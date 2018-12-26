import {Component, ElementRef, OnInit} from '@angular/core';
import {UserService} from "../../services/user.services";
import swal from "sweetalert2";
import {Router} from "@angular/router";

declare const $: any;

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    public userEmail: string;
    public password: string;
    public viewError = {
        error: false,
        msg: ''
    };
    public identity;
    public token;

    focus;
    focus1;
    focus2;
    test: Date = new Date();
    public toggleButton;
    public sidebarVisible: boolean;
    public nativeElement: Node;

    constructor(private element: ElementRef,
                private _userService: UserService,
                private _router: Router) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    checkFullPageBackgroundImage() {
        const $page = $('.full-page');
        const image_src = $page.data('image');

        if (image_src !== undefined) {
            const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit() {
        this.checkFullPageBackgroundImage();
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
    }

    sidebarToggle() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        const sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }

    submit() {
        if (!this.userEmail) {
            this.viewError.error = true;
            this.viewError.msg = 'Se debe ingresar un usuario o email';
            return;
        }

        if (!this.password || this.password.length < 5) {
            this.viewError.error = true;
            this.viewError.msg = 'Se debe ingresar una password valida';
            return;
        }

        this._userService.login(this.userEmail, this.password).subscribe(
            response => {
                this.identity = response;
                localStorage.setItem('identity', JSON.stringify((this.identity)));

                if (!this.identity) {
                    swal({
                        title: 'Error',
                        text: 'Credenciales no validas',
                        type: 'error',
                        confirmButtonClass: 'btn btn-info',
                        buttonsStyling: false
                    })
                } else {
                    // obtain token
                    this._userService.login(this.userEmail, this.password, true).subscribe(
                        responseToken => {
                            this.token = responseToken.token;
                            const expire = responseToken.exp;
                            if (this.token.length <= 0) {
                                swal({
                                    title: 'Error',
                                    text: 'Error con su token',
                                    type: 'error'
                                })
                            } else {
                                localStorage.setItem('token', this.token);
                                localStorage.setItem('exp', expire);
                                this.showNotification('top', 'right');
                                this._router.navigate(['/components/infosys']);
                            }
                        }, errorToken => {
                            const error = JSON.parse(errorToken._body);
                            swal({
                                title: 'Cancelado',
                                text: 'Error: ' + error.desc,
                                type: 'error',
                                confirmButtonClass: 'btn btn-info',
                                buttonsStyling: false
                            });
                        }
                    )
                }
            }, errorLogin => {
                const error = JSON.parse(errorLogin._body);
                swal({
                    title: 'Cancelado',
                    text: 'Error: ' + error.desc,
                    type: 'error',
                    confirmButtonClass: 'btn btn-info',
                    buttonsStyling: false
                });
            }
        )
    }

    showNotification(from, align) {
        const type = ['', 'info', 'success', 'warning', 'danger'];

        const color = Math.floor((Math.random() * 4) + 1);
        $.notify({
            icon: 'ti-user',
            message: 'Bienvenido al <b>Dashboard</b> - ' + this.identity.username
        }, {
            type: type[color],
            timer: 1000,
            placement: {
                from: from,
                align: align
            }
        });
    }
}
