import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ProfileBigPicture from './ProfileBigPicture';
import ProfileNavTab from './ProfileNavTab';
import ProfileTimeLine from './ProfileTimeLine';
import ProfileAbout from './ProfileAbout';
import ProfileFriends from './ProfileFriends';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.getIdUser = this.getIdUser.bind(this);
    this.state = {
      idUser: this.getIdUser(props),
    };
  }

  getIdUser(props) {
    let idUser = null;
    if (props.match.params.idUser === undefined) {
      idUser = window.sessionStorage.userId;
      window.sessionStorage.setItem('wallIdUser', null);
    } else {
      idUser = props.match.params.idUser;
      window.sessionStorage.setItem('wallIdUser', props.match.params.idUser);
    }

    return idUser;
  }

  componentWillUnmount() {
    window.sessionStorage.setItem('wallIdUser', null);
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container page-content">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              {/* profile big picture */}
              <div className="row">
                <div className="col-md-12">
                  <ProfileBigPicture idUser={this.state.idUser} />
                </div>
              </div>
              {/* page content */}
              <div className="row" >
                {/* nav tab */}
                <ProfileNavTab />
                {/* Tab panes */}
                <div className="tab-content">
                  {/* timeline */}
                  <ProfileTimeLine />
                  {/* about */}
                  <ProfileAbout />
                  {/* friends */}
                  <ProfileFriends />
                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>

    );
  }
}

export default Profile;
