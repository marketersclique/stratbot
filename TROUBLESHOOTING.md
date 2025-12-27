# Troubleshooting 500 Internal Server Error

## Common Causes

### 1. Missing AWS IAM Role Permissions (Most Common)
The application uses **IAM Role-based authentication** (no static AWS keys needed).

**For EC2/ECS/Lambda deployments:**
- Ensure the IAM role attached to your instance/task/function has `bedrock:InvokeModel` permission
- The role should have access to the Bedrock model you're using
- Region must be set correctly

**Optional environment variables (if not using IAM role):**
```env
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

**Note:** If running locally and not using IAM roles, you can use AWS CLI credentials (`~/.aws/credentials`) or environment variables, but the code does NOT require explicit credential configuration.

### 2. Missing Dependencies
If you see `ModuleNotFoundError: No module named 'boto3'`, install dependencies:

```bash
cd /home/aryan/Work/strategy/app
./product/bin/python3 -m pip install -r requirements.txt
```

### 3. IAM Role Permissions
- Verify the IAM role has `bedrock:InvokeModel` permission
- Ensure the role has access to the Bedrock model you're using
- Check that the region is correct and Bedrock is enabled in that region
- For local development, ensure AWS credentials are configured via `~/.aws/credentials` or environment variables

### 4. Bedrock Model Access
- Verify the model ID is correct: `anthropic.claude-3-haiku-20240307-v1:0`
- Ensure Bedrock is enabled in your AWS region
- Check if you need to request model access in AWS Bedrock console

### 5. Network/Connection Issues
- Check your internet connection
- Verify AWS service endpoints are accessible
- Check firewall/proxy settings

## How to Check the Actual Error

1. **Check server logs** - The uvicorn output will show the full traceback
2. **Check browser console** - Open DevTools (F12) and check the Network tab for error details
3. **Test the endpoint directly**:
   ```bash
   curl -X POST http://localhost:8000/generate-strategy \
     -H "Content-Type: application/json" \
     -d '{"platforms":["Instagram"],"insights":{},"goal":"Grow followers","duration_days":30}'
   ```

## Quick Fix Checklist

- [ ] IAM role has `bedrock:InvokeModel` permission (for EC2/ECS/Lambda)
- [ ] AWS credentials configured (for local development: `~/.aws/credentials` or env vars)
- [ ] `boto3` and `botocore` are installed
- [ ] `AWS_REGION` environment variable is set (or defaults to us-east-1)
- [ ] Bedrock is enabled in your AWS account for the specified region
- [ ] Model access is granted for Claude models in Bedrock console

