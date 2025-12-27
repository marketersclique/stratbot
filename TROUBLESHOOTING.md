# Troubleshooting 500 Internal Server Error

## Common Causes

### 1. Missing OpenRouter API Key (Most Common)
The application uses **OpenRouter API** for LLM inference.

**Required environment variable:**
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Optional environment variables:**
```env
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=https://your-site.com
OPENROUTER_SITE_NAME=Your Site Name
```

**Note:** 
- Get your API key from https://openrouter.ai
- The default model is `openai/gpt-4o-mini` but you can use any model available on OpenRouter
- Site URL and Site Name are optional and used for rankings on openrouter.ai

### 2. Missing Dependencies
If you see `ModuleNotFoundError: No module named 'openai'`, install dependencies:

```bash
cd /home/aryan/Work/strategy/app
./product/bin/python3 -m pip install -r requirements.txt
```

### 3. Invalid OpenRouter API Key
- Verify your API key is correct at https://openrouter.ai/keys
- Ensure the API key has sufficient credits/balance
- Check that the API key is not expired or revoked

### 4. Model Access Issues
- Verify the model ID is correct (e.g., `openai/gpt-4o-mini`, `anthropic/claude-3-haiku`)
- Check if the model requires special access on OpenRouter
- Ensure your account has access to the selected model

### 5. Network/Connection Issues
- Check your internet connection
- Verify OpenRouter API endpoints are accessible (https://openrouter.ai/api/v1)
- Check firewall/proxy settings
- Ensure no rate limiting is blocking requests

## How to Check the Actual Error

1. **Check server logs** - The uvicorn output will show the full traceback with detailed error messages
2. **Check browser console** - Open DevTools (F12) and check the Network tab for error details
3. **Test the endpoint directly**:
   ```bash
   curl -X POST http://localhost:8000/generate-strategy \
     -H "Content-Type: application/json" \
     -d '{"platforms":["Instagram"],"insights":{},"goal":"Grow followers","duration_days":30}'
   ```

## Quick Fix Checklist

- [ ] `OPENROUTER_API_KEY` environment variable is set
- [ ] OpenRouter API key is valid and has credits
- [ ] `openai` package is installed (`pip install openai`)
- [ ] `OPENROUTER_MODEL` is set to a valid model (or uses default)
- [ ] Internet connection is working
- [ ] No firewall blocking OpenRouter API access
- [ ] Check server logs for detailed error messages

## Environment Variables

Create a `.env` file in the `app/` directory:

```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=https://your-site.com
OPENROUTER_SITE_NAME=Your Site Name
```
