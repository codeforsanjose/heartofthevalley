#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { HeartOfTheValleyStack } from "../lib/deployment-stack";

const deploymentSuffix = process.env.DEPLOYMENT_SUFFIX;
if (!deploymentSuffix || deploymentSuffix.trim() !== "Staging") {
  // For safety, only allow 'staging' deployments from this script; production deployments
  // are not ready yet.
  // Require the DEPLOYMENT_SUFFIX environment variable to be set to 'staging' as in the
  // future, we may have other suffixes like 'production'.
  throw new Error(
    "DEPLOYMENT_SUFFIX environment variable is not set to 'Staging'"
  );
}

const app = new cdk.App();
new HeartOfTheValleyStack(app, `HeartOfTheValleyStack${deploymentSuffix}`);
