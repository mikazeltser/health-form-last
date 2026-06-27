@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  direction: rtl;
}

body {
  font-family: 'Heebo', Arial, sans-serif;
  background-color: #f0f2f7;
  direction: rtl;
  color: #1a1a2e;
}

input,
select,
textarea {
  direction: rtl;
  text-align: right;
  font-family: 'Heebo', Arial, sans-serif;
}

input::placeholder,
textarea::placeholder {
  color: #b0b8cc;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.25s ease;
}
