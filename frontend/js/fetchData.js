const fetchAllPosts = async () => {
  try {
    const res = await fetch("http://localhost:5000/getAllPosts");
    const data = await res.json();
    console.log("data coming from server: ", data);
    showAllPosts(data);
  } catch (err) {
    console.log("error fetching data from server: ", err);
  }
};
const showAllPosts= (allPosts) => {
  console.log("inside show all posts: ",allPosts);
  const postContainer = document.getElementById("post-container");

  postContainer.innerHTML = "";

  allPosts.forEach ( async (post) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    //posts
    postDiv.innerHTML = `
    <div class="post-header">
            <div class="post-user-image">
              <img src=${post.postedUserImage}
              />
            </div>

            <div class="post-username-time">
              <p class="post-username">${post.postedUserName}</p>
              <div class="posted-time">
                <span>${post.postedTime}</span>
                <span>hours ago</span>
              </div>
            </div>
          </div>

          <div class="post-text">
            <p class="post-text-content">
              ${post.postedText}
            </p>
          </div>

          <div class="post-image">
            <img 
            src=${post.postImageUrl}
            />
          </div>
    
    `;
    postContainer.appendChild(postDiv);

    //comments under a post

    let postComments = await fetchAllCommentsOfAPost(post.postId);
    console.log("postComments: ", postComments);
    postComments.forEach((comment) => {
      const commentHolderDiv = document.createElement("div");
      commentHolderDiv.classList.add("comment-holder");

      commentHolderDiv.innerHTML = `
      <div class="comment">
                <div class="comment-user-image">
                 <img src=${comment.commentedUserImage}>
                </div>

                <div class="comment-text-container">
                    <h4>${comment.commentedUserName}</h4>
                    <p class="comment-text">${comment.commentText}</p>
                </div>
            </div>
      `;
      postDiv.appendChild(commentHolderDiv);

    });
});
};

const fetchAllCommentsOfAPost = async (postId) => {
  let commentsOfPost = [];
  try {
    let res = await fetch(`http://localhost:5000/getAllComments/${postId}`);
    commentsOfPost = await res.json();
  } catch (err) {
    console.log("error fetching comments from the server: ", err);
  } finally {
    return commentsOfPost;
  }
};


fetchAllPosts();