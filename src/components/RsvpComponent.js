import React from 'react';
import moment from 'moment'
import { rsvp, fetchMeetup, fetchSpecificGroupMeetup } from '../revamp'

const buttonStyle = {
  borderRadius: '.5rem',
};

// session: {
//   accessToken: '',

export default class RsvpComponent extends React.Component {
  constructor(props){
    super(props);
    this.rsvpMe = this.rsvpMe.bind(this)
    this.fetchSpecificGroupMeetup = fetchSpecificGroupMeetup.bind(this)
    this.fetchMeetup = fetchMeetup.bind(this)
    this.state={
      meetups:[]
    }
    this.rsvp = this.rsvp.bind(this)
    this.props.status="So far no rsvp logged"
  }

  // https://www.meetup.com/meetup_api/docs/batch/
  rsvp(token, id, attendValue) {
    console.log('reached: ', {token, id})
    console.log('reached: ',`${id}`)
    const config = {
      method: 'POST',
      url: 'https://api.meetup.com/2/rsvp',
      params: {
        rsvp: attendValue, //'yes/ no' 
        event_id: `${id}`,
        access_token: token,
      },
      
    };
    return axios(config, {headers: {
        "Accept": "*/*",
        "Referer": "http://127.0.0.1:3000/",
        "Origin": "http://127.0.0.1:3000",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "Postman-Token": "c6853dae-c8b5-476a-8818-ba8c84a4d67a"
      }})
    .catch(err => { console.log(err) })
    .then(res => { console.log(res) });
  }

  rsvpMe = (attendValue) => {
    let meetup = this.state.meetups    
    meetup ? this.state.meetups.map(uniqmeetup => rsvp(this.props.session.accessToken, uniqmeetup.id, attendValue)) : console.log('empty')
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.meetups !== prevProps.meetups) {
      this.setState({meetups:this.props.meetups})
    }
  }

  render() {
    const Header = () => <div id="Header">Logged In as UserName</div>;

    const RsvpButtons = () => (
      <span id="RsvpButton" style={{ display: 'flex' }}>
        <span style={{ minWidth: '170px' }}>
          <button style={buttonStyle} onClick={() => this.rsvpMe('yes')} >
            Rsvp Yes All
          </button>
        </span>
        <span style={{ minWidth: '104px' }}>
          <button style={buttonStyle} onClick={() => this.rsvpMe('no')}>Rsvp No All</button>
        </span>
        <span style={{ width: '100%', textAlign: 'center' }}>
          {this.state.status}
        </span>
      </span>
    );

    // const SearchInput = (
    //   { label } // label
    // ) => (
    //   <div
    //     id="SearchInput"
    //     style={{ display: 'flex', padding: '3px 0px 3px 0px' }}
    //   >
    //     <span style={{ minWidth: '170px' }}>{label}</span>
    //     <span style={{ width: '100%' }}>
    //       <input
    //         style={{ width: '95%' }}
    //         type="text"
    //         name={label}
    //         placeholder="(provides all meetups results if not modified)"
    //       />
    //     </span>
    //   </div>
    // );

    const SearchGroupsUsingButtons = ( {label} ) => {
      return ( <div style={{ maxWidth: '1180px' }}>
        <div style={{ display: 'flex' }}>
          <span style={{minWidth: '170px' }}>{label}</span>
          <button onClick={() => { 
            fetchMeetup(this.props.session.accessToken, {}) 
            .then(x => {this.setState({meetups: x})})
          }}>
            Display All Meetups (default behavior)
          </button>
        </div>
        <br/>
        {this.props.meetups.groups ? this.props.meetups.groups.map( (obj, index) => { 
          return <button onClick={() => {
              fetchSpecificGroupMeetup(this.props.session.accessToken, {}, obj.name)
              .then(x => {this.setState({meetups: x})})
            }
          } key={index} >{obj.name}</button>
          }) : <div></div> 
        }
      </div>
    )
    }

    const Results = () => (
      <div id="Results">
        <div>Results</div>
        <hr/>
          <div>
            {this.state.meetups.map( (meetup, index) => { return <div key={index}>
            <div style={{textAlign:'left'}}>{moment(meetup.time).fromNow()}</div>
            <br/>{ meetup.group.name} at { meetup.venue.name}
            <br/><br/>Join Mode: { meetup.group.join_mode}
            <br/><br/>description: { meetup.description.replace(/<\/?[^>]+(>|$)/g, "")} 
            <br/>{ meetup.venue.repinned}
            <hr/>
          </div>} 
          )}
        </div>
      </div>
    );
    
    return (
      <section style={{ 
          backgroundColor: 'powderblue', paddingTop: '20px', paddingLeft: '20px',
          minWidth: '466px', minHeight: 'calc(100vh - 36px)',
      }} >
        <Header />
        <br />
        <SearchGroupsUsingButtons label="Search Group" />
        <br />
        <RsvpButtons />
        {/*
        <SearchInput label="Search Group" />
        <SearchInput label="Search Common Title" />
        */}
        {/*
        <br />
        <div className="flex">
          <button>Search</button>
        </div>
        */}
        <br />
        <Results />
      </section>
    );
  }
}
