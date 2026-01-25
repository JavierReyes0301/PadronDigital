import os

def solucion_final():
    # Buscamos cualquier archivo que se llame parecido a GirosLineas
    archivo_detectado = ""
    for f in os.listdir('.'):
        if 'GirosLineas' in f and (f.endswith('.xlsx') or f.endswith('.csv')):
            archivo_detectado = f
            break

    if not archivo_detectado:
        print("❌ ERROR: No veo el archivo 'GirosLineas' en esta carpeta.")
        print(f"Archivos actuales: {os.listdir('.')}")
        return

    print(f"Leyendo: {archivo_detectado}...")
    
    try:
        # Lo leemos como texto plano para evitar errores de Excel
        with open(archivo_detectado, 'r', encoding='utf-8', errors='ignore') as f:
            lineas = f.readlines()
        
        opciones = []
        for l in lineas:
            limpia = l.strip()
            # REGLA: Si empieza con GIRO y no es una línea (L1, L2...)
            if limpia.upper().startswith("GIRO") and not limpia.upper().startswith("L"):
                # Quitar comas y basura del final
                texto_final = limpia.split(',')[0].replace('"', '').strip()
                opciones.append(f'<option value="{texto_final}">{texto_final}</option>')

        # CREAR EL ARCHIVO TXT
        with open('LISTO_PARA_COPIAR.txt', 'w', encoding='utf-8') as f_out:
            f_out.write('<option value="">-- Seleccione un Giro --</option>\n')
            for opt in opciones:
                f_out.write(opt + '\n')

        print("------------------------------------------")
        print("✅ ¡LOGRADO!")
        print(f"🔢 Se extrajeron {len(opciones)} giros.")
        print(f"📄 BUSCA EL ARCHIVO: LISTO_PARA_COPIAR.txt")
        print("------------------------------------------")

    except Exception as e:
        print(f"❌ Ocurrió un error: {e}")

if __name__ == "__main__":
    solucion_final()