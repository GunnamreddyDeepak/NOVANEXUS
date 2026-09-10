from fastapi import FastAPI

app = FastAPI(title="BUSSENSE Backend")


@app.get("/health")
def health():
    return {"status": "ok"}