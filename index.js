// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const {
  chromium
} = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // 1. Almacenar IDs únicos con un Set para optimizar memoria
  const articleIds = new Set();

  // 2. Seguir haciendo clic en "More" hasta que tengamos al menos 100 artículos
  while (articleIds.size < 100) {
    const articles = await page.locator(".athing").elementHandles(); // Obtener artículos actuales

    for (const article of articles) {
      const id = await article.getAttribute("id");
      if (id) {
        articleIds.add(parseInt(id, 10)); // Convertir ID a número y agregarlo al Set
        if (articleIds.size >= 100) break; // Detener si ya tenemos 100 IDs
      }
    }

    console.log(`Cargados ${articleIds.size} artículos...`);

    if (articleIds.size >= 100) break; // Salir del bucle si ya tenemos 100 artículos

    //3. Intentar hacer clic en el botón "More"
    const moreButton = page.locator("a.morelink[href*='newest?next=']");
    if (await moreButton.count() > 0) {
      await moreButton.first().click();
      await page.waitForTimeout(5000); // Esperar carga
    } else {
      console.log(`No se encontró el botón "More". Se obtuvieron ${articleIds.size} artículos.`);
      break;
    }
  }

  // 4. Verificar si los artículos están en orden descendente según los IDs
  const articleIdsArray = Array.from(articleIds);
  const isSorted = articleIdsArray.every((id, i, arr) => i === 0 || arr[i - 1] > id);

  if (isSorted) {
    console.log(`Los primeros ${articleIdsArray.length} artículos están ordenados correctamente de más recientes a más antiguos.`);
  } else {
    console.error("Los artículos NO están ordenados correctamente.");
  }

  // 5. Cerrar el navegador
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();