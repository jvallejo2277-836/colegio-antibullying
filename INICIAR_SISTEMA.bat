@echo off
echo ============================================
echo INICIANDO SISTEMA ANTIBULLYING
echo ============================================
echo.

echo [1/4] Verificando MySQL...
net start | findstr -i mysql
if %errorlevel% neq 0 (
    echo ERROR: MySQL no esta corriendo
    pause
    exit /b 1
)
echo ✅ MySQL OK

echo.
echo [2/4] Iniciando Backend Django...
start "Backend Django" cmd /k "cd /d C:\Users\Asus\DesarrolloVSCode\colegio-antibullying\backend && python manage.py runserver"

echo.
echo [3/4] Esperando un momento...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Iniciando Frontend React...
start "Frontend React" cmd /k "cd /d C:\Users\Asus\DesarrolloVSCode\colegio-antibullying\frontend-cra && npm start"

echo.
echo ============================================
echo ✅ SERVIDORES INICIADOS
echo ============================================
echo.
echo Frontend: http://localhost:3000
echo Backend: http://127.0.0.1:8000
echo Admin: http://127.0.0.1:8000/admin/
echo.
echo Credenciales: admin / admin123
echo.
echo Presiona cualquier tecla para abrir navegadores...
pause >nul

echo.
echo Abriendo navegadores...
start http://localhost:3000
start http://127.0.0.1:8000/admin/

echo.
echo ¡Sistema listo para la presentación!
pause