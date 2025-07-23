import os
import sys
import subprocess

def test_executable():
    """Probar el ejecutable y capturar posibles errores"""
    
    # Configurar la codificación de salida
    if sys.platform.startswith('win'):
        import locale
        try:
            # Intentar configurar UTF-8
            locale.setlocale(locale.LC_ALL, 'C.UTF-8')
        except:
            pass
    
    exe_path = os.path.join(os.path.dirname(__file__), '..', 'build', 'win-unpacked', 'Transcriptor Audio a Texto.exe')
    
    if not os.path.exists(exe_path):
        print("❌ Error: No se encontró el ejecutable")
        return False
    
    print("✅ Ejecutable encontrado")
    print(f"📍 Ubicación: {exe_path}")
    
    # Verificar el tamaño
    size = os.path.getsize(exe_path)
    size_mb = size / (1024 * 1024)
    print(f"📏 Tamaño: {size_mb:.2f} MB")
    
    print("🔍 Verificando dependencias...")
    
    # Verificar que los recursos existen
    resources_path = os.path.join(os.path.dirname(exe_path), 'resources')
    if os.path.exists(resources_path):
        print("✅ Carpeta resources encontrada")
        
        app_path = os.path.join(resources_path, 'app')
        if os.path.exists(app_path):
            print("✅ Carpeta app encontrada")
            
            backend_path = os.path.join(app_path, 'backend')
            python_env_path = os.path.join(app_path, 'python-env')
            
            if os.path.exists(backend_path):
                print("✅ Backend incluido")
            else:
                print("❌ Backend no encontrado")
                
            if os.path.exists(python_env_path):
                print("✅ Entorno Python incluido")
            else:
                print("❌ Entorno Python no encontrado")
    
    print("\n🎉 Verificación completa")
    print("💡 Para probar la aplicación:")
    print(f'   "{exe_path}"')
    
    return True

if __name__ == "__main__":
    test_executable()
