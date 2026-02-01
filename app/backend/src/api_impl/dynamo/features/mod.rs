pub mod get_by_id;
pub mod list_features;

/// Replaces "state" attribute in projection expressions as it is a reserved word in DynamoDB.
pub fn sanitize_projection_expression(
    initial_projection_expression: &Option<String>,
) -> (
    Option<String>,
    Option<std::collections::HashMap<String, String>>,
) {
    let mut projection_expression = None;
    let mut expression_attribute_names = None;
    if let Some(proj_expr) = &initial_projection_expression {
        if proj_expr.contains("state") {
            let modified_expr = proj_expr.replace("state", "#st");
            projection_expression = Some(modified_expr);
            let mut expr_attr_names = std::collections::HashMap::new();
            expr_attr_names.insert("#st".to_string(), "state".to_string());
            expression_attribute_names = Some(expr_attr_names);
        } else {
            projection_expression = Some(proj_expr.clone());
        }
    }
    (projection_expression, expression_attribute_names)
}
