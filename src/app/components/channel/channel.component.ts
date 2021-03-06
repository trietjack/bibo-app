import { VideoService } from './../../state/video/video.service';
import { FollowService } from './../../services/follow.service';
import { ComponentWithFollowButton } from './../../abstract-components/component-with-follow-button';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserQuery } from '../../state/user/user.query';
import { VideoQuery } from '../../state/video/video.query';
import { ChannelSideNavActiveType } from './channel-sidenav/channel-sidenav.component';
import { User, Video } from '../../models';
import { resetStore } from 'akita-ng-fire';
import { UserService } from '../../state/user/user.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('padLeft', [
      state('pad', style({ 'padding-left': '250px' })),
      state('unpad', style({ 'padding-left': '0' })),
      transition('* => *', [animate('200ms ease-in')]),
    ]),
  ],
})
export class ChannelComponent
  extends ComponentWithFollowButton
  implements OnInit {
  videos$: Observable<Video[]>;
  user$: Observable<User>;
  me$: Observable<User>;
  visible: boolean;
  activeState: ChannelSideNavActiveType;

  constructor(
    private videoQuery: VideoQuery,
    private videoService: VideoService,
    private route: ActivatedRoute,
    private userQuery: UserQuery,
    private userService: UserService,
    public followService: FollowService,
    public router: Router
  ) {
    super(followService, router);
  }

  ngOnInit(): void {
    this.autoUnsubscribe(
      this.route.params.pipe(
        switchMap(({ id }) => this.userService.syncUser(id))
      )
    ).subscribe;

    this.autoUnsubscribe(
      this.route.params.pipe(
        tap(({ id }) => {
          this.me$ = this.userQuery.selectMyAccount();
        }),
        switchMap(({ id }) => this.videoService.syncVideosForChanel(id))
      )
    ).subscribe();

    this.user$ = this.route.params.pipe(
      switchMap(({ id }) => this.userQuery.selectEntity(id))
    );

    this.videos$ = this.videoQuery.selectAll();
  }

  setVisible(state: boolean): void {
    this.visible = state;
  }

  setActiveState(state: ChannelSideNavActiveType): void {
    this.activeState = state;
  }
}
