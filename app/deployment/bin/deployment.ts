#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { HeartOfTheValleyStack } from "../lib/deployment-stack";

const app = new cdk.App();
new HeartOfTheValleyStack(app, "HeartOfTheValleyStack", {});
