import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseURL = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request', () => {
    const mockData = { message: 'success' };
    
    service.get('/test').subscribe(data => {
      expect(data).toEqual(mockData);
    });
    
    const req = httpMock.expectOne(`${baseURL}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should perform a POST request', () => {
    const mockData = { message: 'created' };
    const postData = { name: 'test' };
    
    service.post('/test', postData).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    
    const req = httpMock.expectOne(`${baseURL}/test`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(mockData);
  });

  it('should perform a PUT request', () => {
    const mockData = { message: 'updated' };
    const putData = { name: 'test' };
    
    service.put('/test', putData).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    
    const req = httpMock.expectOne(`${baseURL}/test`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(putData);
    req.flush(mockData);
  });

  it('should perform a PATCH request', () => {
    const mockData = { message: 'patched' };
    const patchData = { name: 'test' };
    
    service.patch('/test', patchData).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    
    const req = httpMock.expectOne(`${baseURL}/test`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(patchData);
    req.flush(mockData);
  });

  it('should perform a DELETE request', () => {
    const mockData = { message: 'deleted' };
    
    service.delete('/test').subscribe(data => {
      expect(data).toEqual(mockData);
    });
    
    const req = httpMock.expectOne(`${baseURL}/test`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockData);
  });

  it('should handle errors correctly', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Not Found' },
      status: 404,
      statusText: 'Not Found'
    });

    service.get('/error').subscribe({
      next: () => fail('Expected an error, but got success response'),
      error: (error) => {
        expect(error.message).toBe('Not Found');
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${baseURL}/error`);
    req.flush(errorResponse.error, { status: errorResponse.status, statusText: errorResponse.statusText });
  });
});
