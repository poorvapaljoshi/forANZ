const request = require('supertest');
const expect = require('chai').expect;

const api = 'https://cas5-0-urlprotect.trendmicro.com:443/wis/clicktime/v1/query?url=https%3a%2f%2freqres.in%2fapi%2fusers';
const url ='https%3a%2f%2freqres.in%2fapi%2fusers%3fpage%3d1';
const umid='82b3d321-54b0-4153-9766-c2e38c081fa0';
const auth='c36ba5e84c8cc876a4f686d0990d14296745b929-7ef4741bb3c1090c7574b3506467885d774d8c19';

describe('API Tests', function() {
    this.timeout(8000);
  
    let createdUserId;

  it('GET a list of users and filter out first name and email', function(done) {
    request(api)
      .get('%3fpage%3d1&umid=82b3d321-54b0-4153-9766-c2e38c081fa0&auth=c36ba5e84c8cc876a4f686d0990d14296745b929-7ef4741bb3c1090c7574b3506467885d774d8c19')
      .set('UMID',umid)
      .auth(auth)
      .expect(302)
      .end(function(err, res) {
        if (err) return done(err);
        
        setTimeout(function(){
        //const users = res.body.data;
        const users = res.body.data;
        const filteredUsers = users.map(user => {
            return {
              firstName: user.first_name,
              email: user.email
            };
        //const filteredUsers = users.map(user => ({firstName: user.first_name, email: user.email}));
        expect(filteredUsers).to.not.be.empty;
        done();
      },3000);
      });
  });

  it(' GET a user by ID and filter out user details', function(done) {
    
    /**
 * Returns the user details for the given ID.
 *
 * @param {string} id - The user ID to filter by.
 * @returns {Object} - The user details object.
 */
    
    async function getUserDetailsById(id) {
        const response = await request(apiEndpoint)
          .get(`/users/${id}`)
          .expect(200);
        
        // Assuming the API returns an object with the user details
        const userDetails = response.body;
        
        // Ensure the ID in the response matches the requested ID
        expect(userDetails.id).to.equal(id);
        
        return userDetails;
    
    }    
    
    
    it('should return user details for the given ID', async () => {
          const id = '1'; 
          const userDetails = await getUserDetailsById(id);
          request(api)
      .get(`/users/${userId}`)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        const user = res.body.data;
        const filteredUser = {id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email};
        expect(filteredUser).to.not.be.empty;
        done();
        expect(userDetails.name).to.equal('George');
        });
      });
       
            
      });
  });

  it(' POST a new user and retrieve newly created ID', function(done) {
    const user = {
        "email": "poorva.pal@test",
        "first_name": "Poorva",
        "last_name": "Pal",
        "avatar": "https://reqres.in/img/faces/2-image.jpg"
    };

    request(api)
      .post('&umid=82b3d321-54b0-4153-9766-c2e38c081fa0&auth=c36ba5e84c8cc876a4f686d0990d14296745b929-7efb225045a58d1eac0ed15b376dbf84b72aaed8')
      .set('UMID',umid)
      .auth(auth)
      .send(user)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        createdUserId = res.body.id;
        expect(createdUserId).to.not.be.empty;
        done();
      });
  });

  it('PUT an existing user and update user information', function(done) {
    const updatedUser = {
      name: 'XYZ',
      job: 'Product Manager'
    };

    request(api)
      .put(`%2f%7bID&umid=82b3d321-54b0-4153-9766-c2e38c081fa0&auth=c36ba5e84c8cc876a4f686d0990d14296745b929-54dac9aa92cec48371d9d6f12c72eb39391adf4d/${createdUserId}`)
      .send(updatedUser)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        const user = res.body;
        expect(user.name).to.equal(updatedUser.name);
        expect(user.job).to.equal(updatedUser.job);
        done();
      });
  });
});
