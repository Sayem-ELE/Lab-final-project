const fetchAllPosts = async () => {
  try {
    const res = await fetch("http://localhost:5000/getAllPosts");
    const data = await res.json();
    console.log("data coming from server: ", data);
  } catch (err) {
    console.log("error fetching data from server: ", err);
  }
};
fetchAllPosts();