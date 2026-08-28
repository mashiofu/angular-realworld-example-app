import { describe, it, expect, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { apiInterceptor } from './api.interceptor';

describe('apiInterceptor', () => {
  afterEach(() => {
    window.__env__ = undefined;
    TestBed.resetTestingModule();
  });

  function setup() {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([apiInterceptor])), provideHttpClientTesting()],
    });
    return {
      httpClient: TestBed.inject(HttpClient),
      httpTesting: TestBed.inject(HttpTestingController),
    };
  }

  it('prefixes requests with window.__env__.apiUrl when env.js has set it', () => {
    window.__env__ = { apiUrl: 'http://localhost:8080/api' };
    const { httpClient, httpTesting } = setup();

    httpClient.get('/tags').subscribe();

    httpTesting.expectOne('http://localhost:8080/api/tags');
    httpTesting.verify();
  });

  it('falls back to the public demo API if env.js never set apiUrl', () => {
    window.__env__ = undefined;
    const { httpClient, httpTesting } = setup();

    httpClient.get('/tags').subscribe();

    httpTesting.expectOne('https://api.realworld.show/api/tags');
    httpTesting.verify();
  });
});
