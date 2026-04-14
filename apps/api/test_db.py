from db import engine

try:
    conn = engine.connect()
    print("DB CONNECTED SUCCESSFULLY 😤")
    conn.close()
except Exception as e:
    print("DB FAILED 💀", e)