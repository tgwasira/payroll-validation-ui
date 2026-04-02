set -a
# source /home/thomas/Documents/Repositories/payroll-data-validation-stack/dev/supabase-docker/.env.example
source /home/thomas/Documents/Repositories/payroll-data-validation-stack/prod/.env.prod
set +a

# export $(grep -v '^#' /home/thomas/Documents/Repositories/payroll-data-validation-ui/.env.dev | xargs)

npm run dev
