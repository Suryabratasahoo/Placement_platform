@echo off
cd /d "%~dp0"

attrib +h .git 2>nul
attrib +h .next 2>nul
attrib +h node_modules 2>nul

tree /a /f > struct.txt

attrib -h .git 2>nul
attrib -h .next 2>nul
attrib -h node_modules 2>nul

echo Done! struct.txt created.
pause