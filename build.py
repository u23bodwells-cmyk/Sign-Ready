import sys
s=open('src/shell.html').read()
s=s.replace('/*CONTENT*/',open('src/content.js').read()).replace('/*APP*/',open('src/app.js').read())
open('sign-ready.html','w').write(s)
pwa='<link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#1b5e8c"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">'
i=s.index('<title>')
full='<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'+s[:i]+pwa+s[i:].replace('<main','</head><body><script>window.SR_HOSTED=true</script><main',1)+'</body></html>'
import os;os.makedirs('public',exist_ok=True)
open('public/index.html','w').write(full)
print(len(s))
