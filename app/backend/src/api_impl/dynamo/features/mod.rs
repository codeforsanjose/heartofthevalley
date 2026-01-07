//! DynamoDB features operations module
//!
//! This module contains all DynamoDB operations for feature management,
//! including listing features, retrieving individual features, and utilities
//! for handling DynamoDB-specific concerns like reserved words.

pub mod get_by_id;
pub mod list_features;

/// Sanitizes projection expressions to handle DynamoDB reserved words
///
/// DynamoDB has a list of reserved words that cannot be used directly in projection expressions.
/// This function identifies such words and converts them to expression attribute names,
/// which is the recommended way to work around this limitation.
///
/// Currently handles the "state" reserved word, which is commonly used in geographic features
/// but conflicts with DynamoDB's reserved word list.
///
/// # Arguments
///
/// * `initial_projection_expression` - Optional comma-separated list of attribute names to project
///
/// # Returns
///
/// A tuple containing:
/// - `Option<String>` - The sanitized projection expression with reserved words replaced
/// - `Option<HashMap<String, String>>` - Expression attribute names mapping placeholders to actual names
///
/// # Example
///
/// ```rust
/// let (proj_expr, attr_names) = sanitize_projection_expression(
///     &Some("name,state,coordinates".to_string())
/// );
/// // Result: proj_expr = Some("name,#st,coordinates")
/// //         attr_names = Some({"#st" => "state"})
/// ```
pub fn sanitize_projection_expression(
    initial_projection_expression: &Option<String>,
) -> (
    Option<String>,
    Option<std::collections::HashMap<String, String>>,
) {
    let mut projection_expression = None;
    let mut expression_attribute_names = None;
    if let Some(proj_expr) = &initial_projection_expression {
        // "state" is a DynamoDB reserved word requiring expression attribute names
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
