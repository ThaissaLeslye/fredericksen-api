'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">fredericksen-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-991a9093bf767debefcbbe083f7ebd26d66c24a1194b005fddc302e6aef0815a2c913b4ad6b7c8a2cba459b1391771b3df62c75b2acfb6d986ccf599ffe81235"' : 'data-bs-target="#xs-controllers-links-module-AppModule-991a9093bf767debefcbbe083f7ebd26d66c24a1194b005fddc302e6aef0815a2c913b4ad6b7c8a2cba459b1391771b3df62c75b2acfb6d986ccf599ffe81235"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-991a9093bf767debefcbbe083f7ebd26d66c24a1194b005fddc302e6aef0815a2c913b4ad6b7c8a2cba459b1391771b3df62c75b2acfb6d986ccf599ffe81235"' :
                                            'id="xs-controllers-links-module-AppModule-991a9093bf767debefcbbe083f7ebd26d66c24a1194b005fddc302e6aef0815a2c913b4ad6b7c8a2cba459b1391771b3df62c75b2acfb6d986ccf599ffe81235"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-991a9093bf767debefcbbe083f7ebd26d66c24a1194b005fddc302e6aef0815a2c913b4ad6b7c8a2cba459b1391771b3df62c75b2acfb6d986ccf599ffe81235"' : 'data-bs-target="#xs-injectables-links-module-AppModule-991a9093bf767debefcbbe083f7ebd26d66c24a1194b005fddc302e6aef0815a2c913b4ad6b7c8a2cba459b1391771b3df62c75b2acfb6d986ccf599ffe81235"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-991a9093bf767debefcbbe083f7ebd26d66c24a1194b005fddc302e6aef0815a2c913b4ad6b7c8a2cba459b1391771b3df62c75b2acfb6d986ccf599ffe81235"' :
                                        'id="xs-injectables-links-module-AppModule-991a9093bf767debefcbbe083f7ebd26d66c24a1194b005fddc302e6aef0815a2c913b4ad6b7c8a2cba459b1391771b3df62c75b2acfb6d986ccf599ffe81235"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EncryptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EncryptionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-6d49c9eb63bf0fcc7191b45c8480887ea9281bacebe2d9dc1f3ba4afa79edcf8946dbfa4d20dce73361ccd553aa0eef788b9b4e8ae680c6a212ae6eb2fd9fc94"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-6d49c9eb63bf0fcc7191b45c8480887ea9281bacebe2d9dc1f3ba4afa79edcf8946dbfa4d20dce73361ccd553aa0eef788b9b4e8ae680c6a212ae6eb2fd9fc94"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-6d49c9eb63bf0fcc7191b45c8480887ea9281bacebe2d9dc1f3ba4afa79edcf8946dbfa4d20dce73361ccd553aa0eef788b9b4e8ae680c6a212ae6eb2fd9fc94"' :
                                            'id="xs-controllers-links-module-AuthModule-6d49c9eb63bf0fcc7191b45c8480887ea9281bacebe2d9dc1f3ba4afa79edcf8946dbfa4d20dce73361ccd553aa0eef788b9b4e8ae680c6a212ae6eb2fd9fc94"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-6d49c9eb63bf0fcc7191b45c8480887ea9281bacebe2d9dc1f3ba4afa79edcf8946dbfa4d20dce73361ccd553aa0eef788b9b4e8ae680c6a212ae6eb2fd9fc94"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-6d49c9eb63bf0fcc7191b45c8480887ea9281bacebe2d9dc1f3ba4afa79edcf8946dbfa4d20dce73361ccd553aa0eef788b9b4e8ae680c6a212ae6eb2fd9fc94"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-6d49c9eb63bf0fcc7191b45c8480887ea9281bacebe2d9dc1f3ba4afa79edcf8946dbfa4d20dce73361ccd553aa0eef788b9b4e8ae680c6a212ae6eb2fd9fc94"' :
                                        'id="xs-injectables-links-module-AuthModule-6d49c9eb63bf0fcc7191b45c8480887ea9281bacebe2d9dc1f3ba4afa79edcf8946dbfa4d20dce73361ccd553aa0eef788b9b4e8ae680c6a212ae6eb2fd9fc94"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GoogleStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GoogleStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EncryptionModule.html" data-type="entity-link" >EncryptionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EncryptionModule-f1465574efe9a7213818ad9591196b6114629cb84e8e96d0e7b1728e9331afe51f8367fbab87bd8f11255dcd25b9f0078c285867e6b721c77fd63e4a29707517"' : 'data-bs-target="#xs-injectables-links-module-EncryptionModule-f1465574efe9a7213818ad9591196b6114629cb84e8e96d0e7b1728e9331afe51f8367fbab87bd8f11255dcd25b9f0078c285867e6b721c77fd63e4a29707517"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EncryptionModule-f1465574efe9a7213818ad9591196b6114629cb84e8e96d0e7b1728e9331afe51f8367fbab87bd8f11255dcd25b9f0078c285867e6b721c77fd63e4a29707517"' :
                                        'id="xs-injectables-links-module-EncryptionModule-f1465574efe9a7213818ad9591196b6114629cb84e8e96d0e7b1728e9331afe51f8367fbab87bd8f11255dcd25b9f0078c285867e6b721c77fd63e4a29707517"' }>
                                        <li class="link">
                                            <a href="injectables/EncryptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EncryptionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PrismaModule.html" data-type="entity-link" >PrismaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PrismaModule-5ed02f2cc6860b179e634c3b7acd8eebd26441d0f30a31a216f60cb335e1bd487612f38de4d9cfd2f6f53634f578b6dc6e18e9e0f05ca09dd378162f5ade2a41"' : 'data-bs-target="#xs-injectables-links-module-PrismaModule-5ed02f2cc6860b179e634c3b7acd8eebd26441d0f30a31a216f60cb335e1bd487612f38de4d9cfd2f6f53634f578b6dc6e18e9e0f05ca09dd378162f5ade2a41"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PrismaModule-5ed02f2cc6860b179e634c3b7acd8eebd26441d0f30a31a216f60cb335e1bd487612f38de4d9cfd2f6f53634f578b6dc6e18e9e0f05ca09dd378162f5ade2a41"' :
                                        'id="xs-injectables-links-module-PrismaModule-5ed02f2cc6860b179e634c3b7acd8eebd26441d0f30a31a216f60cb335e1bd487612f38de4d9cfd2f6f53634f578b6dc6e18e9e0f05ca09dd378162f5ade2a41"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProfileModule-f6aeb408e7d25f327874edbb0096f024b933246fb605bdd762a8326c71acb82c75ce0918b1bb2be46c4c2ffc1a6a96674aac90924d9478c482f59ae46fead477"' : 'data-bs-target="#xs-controllers-links-module-ProfileModule-f6aeb408e7d25f327874edbb0096f024b933246fb605bdd762a8326c71acb82c75ce0918b1bb2be46c4c2ffc1a6a96674aac90924d9478c482f59ae46fead477"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-f6aeb408e7d25f327874edbb0096f024b933246fb605bdd762a8326c71acb82c75ce0918b1bb2be46c4c2ffc1a6a96674aac90924d9478c482f59ae46fead477"' :
                                            'id="xs-controllers-links-module-ProfileModule-f6aeb408e7d25f327874edbb0096f024b933246fb605bdd762a8326c71acb82c75ce0918b1bb2be46c4c2ffc1a6a96674aac90924d9478c482f59ae46fead477"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProfileModule-f6aeb408e7d25f327874edbb0096f024b933246fb605bdd762a8326c71acb82c75ce0918b1bb2be46c4c2ffc1a6a96674aac90924d9478c482f59ae46fead477"' : 'data-bs-target="#xs-injectables-links-module-ProfileModule-f6aeb408e7d25f327874edbb0096f024b933246fb605bdd762a8326c71acb82c75ce0918b1bb2be46c4c2ffc1a6a96674aac90924d9478c482f59ae46fead477"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-f6aeb408e7d25f327874edbb0096f024b933246fb605bdd762a8326c71acb82c75ce0918b1bb2be46c4c2ffc1a6a96674aac90924d9478c482f59ae46fead477"' :
                                        'id="xs-injectables-links-module-ProfileModule-f6aeb408e7d25f327874edbb0096f024b933246fb605bdd762a8326c71acb82c75ce0918b1bb2be46c4c2ffc1a6a96674aac90924d9478c482f59ae46fead477"' }>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SecurityModule.html" data-type="entity-link" >SecurityModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SecurityModule-2700146577ef29ce410c167208bec31627d8f0b9729ccbd66b16b618d7c6c2283a97997e926b7e273cfbe0406b6e2e02c299b1e9e1ceeb606091f7535950890e"' : 'data-bs-target="#xs-injectables-links-module-SecurityModule-2700146577ef29ce410c167208bec31627d8f0b9729ccbd66b16b618d7c6c2283a97997e926b7e273cfbe0406b6e2e02c299b1e9e1ceeb606091f7535950890e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SecurityModule-2700146577ef29ce410c167208bec31627d8f0b9729ccbd66b16b618d7c6c2283a97997e926b7e273cfbe0406b6e2e02c299b1e9e1ceeb606091f7535950890e"' :
                                        'id="xs-injectables-links-module-SecurityModule-2700146577ef29ce410c167208bec31627d8f0b9729ccbd66b16b618d7c6c2283a97997e926b7e273cfbe0406b6e2e02c299b1e9e1ceeb606091f7535950890e"' }>
                                        <li class="link">
                                            <a href="injectables/EncryptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EncryptionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-32e40ee452d0509b010a04ef37874f1a6876cc5de73e5753bd14aa1984be935fe39a6002777752690b30c4301a31f04fda1b5bae61ba277d968649cfe7fa3e50"' : 'data-bs-target="#xs-controllers-links-module-UserModule-32e40ee452d0509b010a04ef37874f1a6876cc5de73e5753bd14aa1984be935fe39a6002777752690b30c4301a31f04fda1b5bae61ba277d968649cfe7fa3e50"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-32e40ee452d0509b010a04ef37874f1a6876cc5de73e5753bd14aa1984be935fe39a6002777752690b30c4301a31f04fda1b5bae61ba277d968649cfe7fa3e50"' :
                                            'id="xs-controllers-links-module-UserModule-32e40ee452d0509b010a04ef37874f1a6876cc5de73e5753bd14aa1984be935fe39a6002777752690b30c4301a31f04fda1b5bae61ba277d968649cfe7fa3e50"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-32e40ee452d0509b010a04ef37874f1a6876cc5de73e5753bd14aa1984be935fe39a6002777752690b30c4301a31f04fda1b5bae61ba277d968649cfe7fa3e50"' : 'data-bs-target="#xs-injectables-links-module-UserModule-32e40ee452d0509b010a04ef37874f1a6876cc5de73e5753bd14aa1984be935fe39a6002777752690b30c4301a31f04fda1b5bae61ba277d968649cfe7fa3e50"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-32e40ee452d0509b010a04ef37874f1a6876cc5de73e5753bd14aa1984be935fe39a6002777752690b30c4301a31f04fda1b5bae61ba277d968649cfe7fa3e50"' :
                                        'id="xs-injectables-links-module-UserModule-32e40ee452d0509b010a04ef37874f1a6876cc5de73e5753bd14aa1984be935fe39a6002777752690b30c4301a31f04fda1b5bae61ba277d968649cfe7fa3e50"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProfileController.html" data-type="entity-link" >ProfileController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Auth.html" data-type="entity-link" >Auth</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileDto.html" data-type="entity-link" >CreateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariables.html" data-type="entity-link" >EnvironmentVariables</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileEntity.html" data-type="entity-link" >ProfileEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link" >UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntity.html" data-type="entity-link" >UserEntity</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EncryptionService.html" data-type="entity-link" >EncryptionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleStrategy.html" data-type="entity-link" >GoogleStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaService.html" data-type="entity-link" >PrismaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ActiveUser.html" data-type="entity-link" >ActiveUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GoogleUser.html" data-type="entity-link" >GoogleUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser-1.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser-2.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserPayload.html" data-type="entity-link" >UserPayload</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});