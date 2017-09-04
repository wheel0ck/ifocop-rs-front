import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import Async from 'async';
import HomePostStateForm from './HomePostStateForm';
import HomePosts from './HomePosts';


class HomeCenterPosts extends React.Component {
  constructor(props) {
    super(props);
    this.getPosts = this.getPosts.bind(this);
    this.refreshPosts = this.refreshPosts.bind(this);
    this.state = { posts: null };
    this.getPosts();
  }


  // {"where": {"parentId": {"neq": null}}, "order": "dateCreated DESC"}
  // {"where": {"parentId": {"eq": null}}, "order": "dateCreated DESC"}
  // {"where": {"parentId": {"neq": null}}, "order": "dateCreated ASC"}
  // {"where":{"parentId": null},  "order": "dateCreated DESC"}

  getPosts() {
    if (this.props.path === 'profile') {
      request
        .get(`${process.env.REACT_APP_URL_API}/myUsers/${this.props.idUser}/walls?filter={"where":{"parentId": null}, "order": "dateCreated DESC"}`)
        .set('Authorization', sessionStorage.token)
        // probleme avec null
        // .query({ filter: { where: { parentId: 'null' }, order: 'dateCreated DESC' } })
        .end((err, res) => {
          if (res.statusCode === 200) {
            console.log('--- home center posts valide ---');
            this.setState({ posts: res.body });
          } else {
            console.log('--- home center posts error ---');
          }
        });
    }

    if (this.props.path === 'home') {
      Async.parallel([
        // recupère tous le wall
        function (callback) {
          request
            .get(`${process.env.REACT_APP_URL_API}/walls?filter={"where":{"parentId": null}, "order": "dateCreated DESC"}`)
            .set('Authorization', sessionStorage.token)
            // .query({ filter: { where: { parentId: `null` }, order: 'dateCreated DESC' } })
            .end((err, res) => {
              if (res.statusCode === 200) {
                console.log('--- get wall  ---');
                callback(null, res.body);
              } else {
                console.log('--- get wall error ---');
              }
            });
        },
        // recupere tous les friends de l user
        function (callback) {
          request
            .get(`${process.env.REACT_APP_URL_API}/friendsLists/getFriendship`)
            .query({ idUser: sessionStorage.userId, isConfirmed: true })
            .set('Authorization', sessionStorage.token)
            .end((err, res) => {
              if (res.statusCode === 200) {
                console.log('--- get friendship request  ---');
                // @warning ...[{}] != [{}, {}]
                callback(null, res.body.friendship);
              } else {
                console.log('--- get friendship request error ---');
              }
            });
        },
      ], (err, results) => {
        const idFriends = [];
        results[1].map((friendship) => {
          if (friendship.receiver === sessionStorage.userId) {
            idFriends.push(friendship.sender);
          } else {
            idFriends.push(friendship.receiver);
          }
        });
        idFriends.push(sessionStorage.userId);

        const posts = [];

        results[0].map((element) => {
          for (const idFriend of idFriends) {
            if (element.myUserId === idFriend) {
              posts.push(element);
            }
          }
        });

        this.setState({ posts });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ posts: null }, () => {
      this.getPosts();
    });
  }

  refreshPosts() {
    this.setState({ posts: null }, () => {
      this.getPosts();
    });
  }


  render() {
    const colmd = `col-md-${this.props.colmd}`;

    const renderHomePosts = [];
    if (this.state.posts !== null) {
      this.state.posts.map((post) => {
        renderHomePosts.push(<HomePosts key={post.id} value={post} path={this.props.path} />);
      });
    }

    return (
    // ici pour profile page md-12
    // ici pour la home md-9
    // <div className="col-md-9">
      <div className={colmd}>
        <div className="row">
          {/* <!-- left posts--> */}
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                {/* <!-- post state form --> */}
                <HomePostStateForm idUser={this.props.idUser || sessionStorage.userId} refreshPosts={this.refreshPosts} />
                {/* <!--   posts --> */}
                {/* <HomePosts /> */}

                {renderHomePosts}
                {/* <HomePosts /> */}

              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }
}
HomeCenterPosts.propTypes = {
  colmd: PropTypes.number.isRequired,
  idUser: PropTypes.string,
  path: PropTypes.string.isRequired,
};

export default HomeCenterPosts;
