import uvicorn

HOST='0.0.0.0'

PORT=8000

if __name__ == '__main__':
    uvicorn.run('app.api:app', host=HOST, port=PORT, reload=True)