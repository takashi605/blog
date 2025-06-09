use crate::tests::helper::http::{methods::Methods, request::Request};
use anyhow::Result;
use serde_json::Value;

#[tokio::test]
async fn test_get_openapi_spec() -> Result<()> {
    // OpenAPI仕様書のエンドポイントをテスト
    let request = Request::new(Methods::GET, "http://localhost:8000/openapi.json");
    let response = request.send().await?;

    // レスポンスステータスの確認
    assert_eq!(response.status(), 200);

    // レスポンスボディをJSONとしてパース
    let body_text = response.text().await?;
    let openapi_spec: Value = serde_json::from_str(&body_text)?;
    assert!(openapi_spec.is_object());

    // OpenAPI仕様の必須フィールドが存在することを確認
    assert!(openapi_spec.get("openapi").is_some());
    assert!(openapi_spec.get("info").is_some());
    assert!(openapi_spec.get("paths").is_some());
    assert!(openapi_spec.get("components").is_some());

    // OpenAPIバージョンの確認
    let openapi_version = openapi_spec["openapi"].as_str().unwrap();
    assert!(openapi_version.starts_with("3."));

    // パス情報の確認
    let paths = &openapi_spec["paths"];
    assert!(paths.is_object());

    // 主要なエンドポイントが含まれていることを確認
    assert!(paths.get("/api/blog/posts/latest").is_some());
    assert!(paths.get("/api/blog/posts/{uuid}").is_some());
    assert!(paths.get("/api/admin/blog/posts").is_some());
    assert!(paths.get("/api/blog/images").is_some());
    assert!(paths.get("/api/admin/blog/images").is_some());

    // スキーマ定義の確認
    let components = &openapi_spec["components"];
    assert!(components.is_object());
    
    let schemas = &components["schemas"];
    assert!(schemas.is_object());
    
    // 主要なスキーマが定義されていることを確認
    assert!(schemas.get("BlogPost").is_some());
    assert!(schemas.get("Image").is_some());
    assert!(schemas.get("BlogPostContent").is_some());

    println!("OpenAPI specification test passed successfully");
    Ok(())
}

#[tokio::test]
async fn test_openapi_spec_blog_post_schema() -> Result<()> {
    // BlogPostスキーマの詳細をテスト
    let request = Request::new(Methods::GET, "http://api/openapi.json");
    let response = request.send().await?;

    let body_text = response.text().await?;
    let openapi_spec: Value = serde_json::from_str(&body_text)?;
    let blog_post_schema = &openapi_spec["components"]["schemas"]["BlogPost"];

    // BlogPostスキーマの構造を確認
    assert!(blog_post_schema.get("type").is_some());
    assert_eq!(blog_post_schema["type"], "object");

    let properties = &blog_post_schema["properties"];
    assert!(properties.get("id").is_some());
    assert!(properties.get("title").is_some());
    assert!(properties.get("thumbnail").is_some());
    assert!(properties.get("postDate").is_some());
    assert!(properties.get("lastUpdateDate").is_some());
    assert!(properties.get("contents").is_some());

    // contentsフィールドが配列であることを確認
    let contents_property = &properties["contents"];
    assert_eq!(contents_property["type"], "array");

    println!("BlogPost schema test passed successfully");
    Ok(())
}

#[tokio::test]
async fn test_openapi_spec_endpoints_methods() -> Result<()> {
    // エンドポイントのHTTPメソッドが正しく定義されていることをテスト
    let request = Request::new(Methods::GET, "http://api/openapi.json");
    let response = request.send().await?;

    let body_text = response.text().await?;
    let openapi_spec: Value = serde_json::from_str(&body_text)?;
    let paths = &openapi_spec["paths"];

    // GETエンドポイントの確認
    let latest_posts_path = &paths["/api/blog/posts/latest"];
    assert!(latest_posts_path.get("get").is_some());
    assert_eq!(latest_posts_path["get"]["responses"]["200"]["description"], "Latest blog posts");

    // POSTエンドポイントの確認
    let create_post_path = &paths["/api/admin/blog/posts"];
    assert!(create_post_path.get("post").is_some());
    assert_eq!(create_post_path["post"]["responses"]["200"]["description"], "Blog post created");

    // PUTエンドポイントの確認
    let update_pickup_path = &paths["/api/admin/blog/posts/pickup"];
    assert!(update_pickup_path.get("put").is_some());
    assert_eq!(update_pickup_path["put"]["responses"]["200"]["description"], "Pickup blog posts updated");

    // パラメータ付きエンドポイントの確認
    let get_post_path = &paths["/api/blog/posts/{uuid}"];
    assert!(get_post_path.get("get").is_some());
    
    let parameters = &get_post_path["get"]["parameters"];
    assert!(parameters.is_array());
    assert_eq!(parameters[0]["name"], "uuid");
    assert_eq!(parameters[0]["in"], "path");

    println!("Endpoints methods test passed successfully");
    Ok(())
}