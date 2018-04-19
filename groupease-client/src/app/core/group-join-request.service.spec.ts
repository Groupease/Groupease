import { TestBed, inject } from '@angular/core/testing';

import { GroupJoinRequestService } from './group-join-request.service';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

describe('GroupJoinRequestService', () => {

  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {

    authService = jasmine.createSpyObj(
      'AuthService',
      [
        'isAuthenticated'
      ]
    );

    TestBed.configureTestingModule({
      providers: [
        GroupJoinRequestService,
        {
          provide: AuthService,
          useValue: authService
        }
      ],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('should be created', inject([GroupJoinRequestService], (service: GroupJoinRequestService) => {
    expect(service).toBeTruthy();
  }));

});
