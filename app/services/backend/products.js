export const getProducts = async () => {
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        const json = await res.json();
        return json;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
export const getAds = async (filter) => {
    return await fetch("https://ads-get-" + env + "-ue.a.run.app", {
      method: "post",
      body: JSON.stringify(filter),
      headers: { "Content-Type": "application/json" },
    });
  };
