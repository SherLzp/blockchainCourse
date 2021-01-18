const donate= artifacts.require("donate");
module.exports= function (deployer){
	deployer.deploy(donate);
};