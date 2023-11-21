const date = new Date().toISOString().slice(0, 10);

const fetch_followers_hash = 'c76146de99bb02f6415203be841dd25a';
const fetch_following_hash = 'd04b0a864b4b54837c0d870b0e77e076';

function request_download(content, filename) {

  // Format the json with 4 spaces
  // Source: https://stackoverflow.com/a/2614874/12873636
  string = JSON.stringify(content, null, 4);

  let file = new Blob( [string], {type: 'text/plain'});
    let link = document.createElement('a');
    link.download = filename;
    link.href = window.URL.createObjectURL(file);
    link.target = "_blank"
    link.click();
    link.remove();
}

async function start_fetch(username) {

  console.log(`Process started! Give it a couple of seconds`);

  const user = await fetch_user_info(username);
  const user_id = user.pk;
  const following = await fetch_following(user_id);
  const followers = await fetch_followers(user_id);

  const content = {
    'user_name': username,
    'full_name': user.full_name,
    'user_id': user_id,
    'profile_picture_url': user.profile_pic_url,
    'date': date,
    'following': following,
    'followers': followers
  }
  console.log('Finished ... Requesting download of the content ...')
  request_download(content, `${username} ${date}.json`)
}

async function fetch_user_info(username) {
  console.log(`Started process to fetch user ${username} information ...`);
  const userQueryRes = await fetch(
    `https://www.instagram.com/web/search/topsearch/?query=${username}`
  );
  const userQueryJson = await userQueryRes.json();
  return userQueryJson.users[0].user;
};

async function fetch_following(user_id) {
  return fetch_follow(user_id, 'following');
};

async function fetch_followers(user_id) {
  return fetch_follow(user_id, 'followers');
};

async function fetch_follow(user_id, mode) {

  console.log(`Started fetch of ${mode} from user: ${user_id}`);

  let after = null;
  let has_next = null;
  let result = [];

  hash_id = mode == 'followers' ? fetch_followers_hash : fetch_following_hash;

  do 
  {
    await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=${hash_id}&variables=` +
        encodeURIComponent(
          JSON.stringify({
            id: user_id,
            include_reel: true,
            fetch_mutual: true,
            first: 50,
            after: after,
          })
        )
    )
    .then((res) => res.json())
    .then((res) => {
      const response = mode == 'following' ? res.data.user.edge_follow : res.data.user.edge_followed_by; 
      has_next = response.page_info.has_next_page;
      after = response.page_info.end_cursor;
      result = result.concat(
        response.edges.map(({ node }) => {
          return {
            'user_name': node.username,
            'full_name': node.full_name,
            'id': node.id,
            'private': node.private,
            'verified': node.verified,
            'profile_picture_url': node.profile_pic_url
          }
        })
      );
    });
  } while(has_next)
  console.log(`Finished fetch of ${mode} from user: ${user_id}, total of users retrieved: ${result.length}`);
  return result;
};

