App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        // Load Items.
        $.getJSON('../commodity.json', function (data) {
            var petsRow1 = $('#petsRow1');
            var petsRow2 = $('#petsRow2');
            var petsRow3 = $('#petsRow3');
            var petsRow4 = $('#petsRow4');
            
            var title1 = $('#title1');
            var title2 = $('#title2');
            var title3 = $('#title3');
            var title4 = $('#title4');

            var petTemplate1 = $('#petTemplate1');
            var petTemplate2 = $('#petTemplate2');
            var petTemplate3 = $('#petTemplate3');
            var petTemplate4 = $('#petTemplate4');

            title1.find('.title-1').text("日常生活");
            for (i = 0; i < 4; i++) {
                petTemplate1.find('.panel-title').text(data[i].name);
                petTemplate1.find('img').attr('src', data[i].picture);
                petTemplate1.find('.pet-breed').text(data[i].breed);
                petTemplate1.find('.pet-age').text(data[i].age);
                petTemplate1.find('.pet-location').text(data[i].location);
                petTemplate1.find('.repertory').text(data[i].repertory);
                petTemplate1.find('.likenumber').text(data[i].likenumber);
                petTemplate1.find('.btn-adopt').attr('data-id', data[i].id);
                petTemplate1.find('.btn-like').attr('data-id', data[i].id);
                
                

                petsRow1.append(petTemplate1.html());
            }

            title2.find('.title-2').text("动漫周边");
            for (i = 4; i < 8; i++) {
                petTemplate2.find('.panel-title').text(data[i].name);
                petTemplate2.find('img').attr('src', data[i].picture);
                petTemplate2.find('.pet-breed').text(data[i].breed);
                petTemplate2.find('.pet-age').text(data[i].age);
                petTemplate2.find('.pet-location').text(data[i].location);
                petTemplate2.find('.likenumber').text(data[i].likenumber);
                petTemplate2.find('.repertory').text(data[i].repertory);
                petTemplate2.find('.btn-adopt').attr('data-id', data[i].id);
                petTemplate2.find('.btn-like').attr('data-id', data[i].id);
                
                

                petsRow2.append(petTemplate2.html());
            }

            title3.find('.title-3').text("电子设备");
            for (i = 8; i < 12; i++) {
                petTemplate3.find('.panel-title').text(data[i].name);
                petTemplate3.find('img').attr('src', data[i].picture);
                petTemplate3.find('.pet-breed').text(data[i].breed);
                petTemplate3.find('.pet-age').text(data[i].age);
                petTemplate3.find('.pet-location').text(data[i].location);
                petTemplate3.find('.repertory').text(data[i].repertory);
                petTemplate3.find('.likenumber').text(data[i].likenumber);
                petTemplate3.find('.btn-adopt').attr('data-id', data[i].id);
                petTemplate3.find('.btn-like').attr('data-id', data[i].id);
                
                

                petsRow3.append(petTemplate3.html());
            }

            title4.find('.title-4').text("个人护理");
            for (i = 12; i < data.length; i++) {
                petTemplate4.find('.panel-title').text(data[i].name);
                petTemplate4.find('img').attr('src', data[i].picture);
                petTemplate4.find('.pet-breed').text(data[i].breed);
                petTemplate4.find('.pet-age').text(data[i].age);
                petTemplate4.find('.pet-location').text(data[i].location);
                petTemplate4.find('.repertory').text(data[i].repertory);
                petTemplate4.find('.likenumber').text(data[i].likenumber);
                petTemplate4.find('.btn-adopt').attr('data-id', data[i].id);
                petTemplate4.find('.btn-like').attr('data-id', data[i].id);
                
                
                petsRow4.append(petTemplate4.html());
            }

        });


        return await App.initWeb3();
    },

    initWeb3: async function () {

        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
             //If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {

        // 加载Adoption.json，保存了Adoption的ABI（接口说明）信息及部署后的网络(地址)信息，它在编译合约的时候生成ABI，在部署的时候追加网络信息
        $.getJSON('Adoption.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            // 用Adoption.json数据创建一个可交互的TruffleContract合约实例。
            var AdoptionArtifact = data;
            App.contracts.Adoption = TruffleContract(AdoptionArtifact);

            // Set the provider for our contract
            App.contracts.Adoption.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.markAdopted();
        });

        $.getJSON('Like.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            // 用Adoption.json数据创建一个可交互的TruffleContract合约实例。
            var AdoptionArtifact = data;
            App.contracts.Like = TruffleContract(AdoptionArtifact);

            // Set the provider for our contract
            App.contracts.Like.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.markliked();
        });




        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
        $(document).on('click', '.btn-like', App.handlelike);
    },

    markAdopted: function (adopters, account) {

        var adoptionInstance;
        var data = [6148,3101,5433,750,192,648,892,739,5046,554,2004,1284,1283,4105,5138,3136];
        App.contracts.Adoption.deployed().then(function (instance) {
            adoptionInstance = instance;

            // 调用合约的getAdopters(), 用call读取信息不用消耗gas
            return adoptionInstance.getVolume.call();
        }).then(function (volume) {
            for (i = 0; i < volume.length; i++) {
                $('.panel-pet').eq(i).find('.repertory').text(data[i] + volume[i]);
            }
        }).catch(function (err) {
            console.log(err.message);
        });
    },
    
    
    markliked: function (adopters, account) {

        var adoptionInstance;
        var data = [16,19,17,5,184,16,9,5,37,0,29,32,21,27,91,64];
        App.contracts.Like.deployed().then(function (instance) {
            adoptionInstance = instance;

            // 调用合约的getAdopters(), 用call读取信息不用消耗gas
            return adoptionInstance.getlike.call();
        }).then(function (thelike) {
            for (i = 0; i < thelike.length; i++) {
                $('.panel-pet').eq(i).find('.likenumber').text(data[i] + thelike[i]);
            }
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    handlelike: function (event) {
        event.preventDefault();
        console.log(event.currentTarget.activeElement);
        console.log(event.target);

        var petId = parseInt($(event.currentTarget).data('id'));
        console.log($(event.target).data('id'));

        var adoptionInstance;

        // 获取用户账号
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            
            var account =  accounts[0];

            App.contracts.Like.deployed().then(function (instance) {
                adoptionInstance = instance;
                console.log(petId);
                // 发送交易支持某一众筹产品
                return adoptionInstance.thelike(petId, {from: account});
            }).then(function (result) {
                return App.markliked();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    handleAdopt: function (event) {
        event.preventDefault();
        console.log(event.currentTarget.activeElement);
        console.log(event.target);

        var petId = parseInt($(event.target).data('id'));
        console.log($(event.target).data('id'));
        var adoptionInstance;

        // 获取用户账号
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
            
            var account =  accounts[0];

            App.contracts.Adoption.deployed().then(function (instance) {
                adoptionInstance = instance;

                // 发送交易购买某一众筹产品
                return adoptionInstance.adopt(petId, {from: account});
            }).then(function (result) {
                return App.markAdopted();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
