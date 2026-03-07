export $(grep -v '^#' /home/thomas/Documents/Repositories/payroll-data-validation-stack/.env.dev | xargs)
uvicorn app.main:app --port 8000 --log-config logging.dev.yaml --reload