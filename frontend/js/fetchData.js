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

    //adding a new comment

    let addNewCommentDiv = document.createElement("div");
    addNewCommentDiv.classList.add("postComment-holder");
    addNewCommentDiv.innerHTML = `
    <div class="post-comment-input-field-holder">
                    <input type="text" placeholder="post your comment" id="postComment-input-for-postId-${post.postId}" class="postComment-input-field" >
                </div>
                <div class="comment-btn-holder">
                    <button onClick = handlePostComment(${post.postId}) id="comment-btn" class="postComment-btn">Comment</button>
                </div>
    `;
    postDiv.appendChild(addNewCommentDiv);
});
};

const handlePostComment = async (postId) => {
  //collecting logged in user ID from local storage
  let user =localStorage.getItem("loggedInUser");
  if(user){
    user = JSON.parse(user);
  }

  const commentedUserId = user.userId;
  
  //getting comment text from input
  const commentTextElement = document.getElementById(
    `postComment-input-for-postId-${postId}`
  );
  const commentText = commentTextElement.value;
  //current time of the comment

  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  let timeOfComment = now.toISOString();
  
   const commentObject = {
    commentOfPostId: postId,
    commentedUserId: commentedUserId,
    commentTime: timeOfComment,
    commentText: commentText,
  };

  try{
    const res = await fetch("http://localhost:5000/postComment", {
      method: "POST",
      headers: {
      "content-type": "application/json",
      },
      body: JSON.stringify(commentObject),
    });
    const data = await res.json();

  } catch (err){
    console.log("error while sending data to the server", err);
  } finally{
    location.reload();
  }

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