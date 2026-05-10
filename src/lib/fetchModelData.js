/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
async function fetchModel(url) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`https://34dct4-8081.csb.app/api${url}`, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("fetchModel error:", error);
    throw error;
  }
}

export default fetchModel;
