#!/bin/bash

# backup first
cp index.html index.backup.html

# remove OpenAI key input lines
sed -i '/OpenAI API key/d' index.html
sed -i '/apiKey/d' index.html
sed -i '/openai/dI' index.html

# replace broken/old founder image src/alt if present
sed -i 's|src="[^"]*" alt="Richard Sy[^"]*"|src="/images/richard-founder.jpg" alt="Richard Sy, Founder"|g' index.html
sed -i 's|src="[^"]*" alt="Richard Sy Founder[^"]*"|src="/images/richard-founder.jpg" alt="Richard Sy, Founder"|g' index.html

# add founder image if not found
if ! grep -q 'richard-founder.jpg' index.html; then
  sed -i '/Founder/i\
<img src="/images/richard-founder.jpg" alt="Richard Sy, Founder" class="founder-image">
' index.html
fi

# add CSS before </head> if not already present
if ! grep -q '.founder-image' index.html; then
  sed -i '/<\/head>/i\
<style>\
.founder-image {\
  width: 100%;\
  max-width: 520px;\
  height: auto;\
  display: block;\
  border-radius: 18px;\
  border: 1px solid rgba(110,231,183,.25);\
  object-fit: cover;\
}\
</style>
' index.html
fi

echo "Done. Put your image here: images/richard-founder.jpg"
echo "Backup saved as: index.backup.html"
