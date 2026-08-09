#!/usr/bin/env python3
"""Arma mg-ingenieria.html: una sola página con el CSS, el JavaScript y las
imágenes incrustados, para poder abrirla sin la carpeta assets al lado.

Uso:  python3 construir.py
"""
import base64
import pathlib
import re

RAIZ = pathlib.Path(__file__).parent
TIPOS = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml'}


def data_uri(rel: str) -> str:
    ruta = RAIZ / rel
    mime = TIPOS[ruta.suffix.lower()]
    return f'data:{mime};base64,' + base64.b64encode(ruta.read_bytes()).decode()


def main() -> None:
    html = (RAIZ / 'index.html').read_text(encoding='utf-8')
    css = (RAIZ / 'assets/css/styles.css').read_text(encoding='utf-8')
    js = (RAIZ / 'assets/js/main.js').read_text(encoding='utf-8')

    html = html.replace('<link rel="stylesheet" href="assets/css/styles.css">',
                        '<style>\n' + css + '\n</style>')
    html = html.replace('<script src="assets/js/main.js"></script>',
                        '<script>\n' + js + '\n</script>')

    # Solo las rutas locales: las absolutas (og:image, datos estructurados)
    # deben seguir apuntando al sitio publicado.
    for rel in sorted(set(re.findall(r'(?<!/)assets/img/[\w.-]+', html)), key=len, reverse=True):
        html = html.replace('"' + rel + '"', '"' + data_uri(rel) + '"')

    destino = RAIZ / 'mg-ingenieria.html'
    destino.write_text(html, encoding='utf-8')
    print(f'{destino.name}: {destino.stat().st_size / 1024:.0f} KB')

    sobrantes = re.findall(r'(?<!/)assets/(?:img|css|js)/[\w.-]+', html)
    if sobrantes:
        raise SystemExit(f'quedaron rutas sin incrustar: {sorted(set(sobrantes))}')


if __name__ == '__main__':
    main()
