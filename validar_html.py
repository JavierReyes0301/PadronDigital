import glob
import os
from bs4 import BeautifulSoup

def validador_maestro():
    # 1. Obtener lista de todos los archivos que existen físicamente
    archivos_en_carpeta = os.listdir('.')
    archivos_html = glob.glob("*.html")
    
    print(f"🚀 INICIANDO VALIDACIÓN INTEGRAL...")
    print(f"📂 Archivos HTML detectados en carpeta: {archivos_html}\n")

    for archivo in archivos_html:
        print(f"📄 ANALIZANDO: {archivo}")
        with open(archivo, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        
        # --- VERIFICAR ENLACES A OTRAS PÁGINAS ---
        enlaces = soup.find_all('a', href=True)
        errores_enlace = 0
        
        for link in enlaces:
            href = link['href']
            
            # Ignorar enlaces externos (Google, Facebook, etc.) y anclas (#)
            if href.startswith('http') or href.startswith('#') or href == "":
                continue
            
            # Verificar si el archivo al que apunta el enlace EXISTE
            if href not in archivos_en_carpeta:
                print(f"   ❌ ERROR: El enlace a '{href}' está roto (El archivo no existe en tu carpeta).")
                errores_enlace += 1
        
        # --- VERIFICAR IDs DUPLICADOS ---
        ids = [tag['id'] for tag in soup.find_all(id=True)]
        duplicados = set([x for x in ids if ids.count(x) > 1])
        if duplicados:
            print(f"   ⚠️ ADVERTENCIA: IDs duplicados: {duplicados}")

        if errores_enlace == 0:
            print(f"   ✅ Todos los enlaces a otras páginas están correctos.")
        
        print("-" * 40)

validador_maestro()