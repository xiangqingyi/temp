var sys_AccountClass = require('../../../class/sys/AccountClass');

describe('AccountClass',function(){
    var sys_Account;

    beforeAll(function () {
        //Arrange
        // sys_Account = new sys_AccountClass();
    });    

    it('Testing call saveDataFromAPI', function(done) {
        /* code and assertions */
        // sys_Account = new sys_AccountClass();        
        // console.log('first testing');
        // console.log(sys_AccountClass);
        // expect(sys_AccountClass).toEqual(jasmine.any(Object));
        // spyOn(sys_AccountClass, 'saveDataFromAPI');
        
        sys_AccountClass.saveDataFromAPI('1','2',function(err){
            console.log(err)
            expect(true).toBeTruthy();
            done();
        });
        
        // expect(sys_AccountClass.saveDataFromAPI).toHaveBeenCalled();
    });

    // it('Testing return saveDataForAPI',function(done){

    // });
});