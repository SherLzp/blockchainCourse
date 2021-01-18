pragma solidity >=0.4.22 <0.8.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "../crowdfunding.sol";
contract testSuite {
    crowdFundingFactory factory;
    crowdFundingProject pro;
    function beforeAll() public{
        factory=new crowdFundingFactory();
        pro=new crowdFundingProject("help","ill",2,100,1000000,msg.sender);
    }
    function testCreateProject() public{
        factory.createProject("1","2",1,100,100000);
    }
    function testGetProjects() public{
        factory.getProjects;
    }
}
