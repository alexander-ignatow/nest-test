import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', () => {
      return request(httpServer)
        .post('/auth/register')
        .send({ email: 'e2e@example.com', password: 'password123' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should fail with invalid email', () => {
      return request(httpServer)
        .post('/auth/register')
        .send({ email: 'not-an-email', password: 'password123' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      await request(httpServer)
        .post('/auth/register')
        .send({ email: 'login-test@example.com', password: 'password123' });
    });

    it('should login successfully', () => {
      return request(httpServer)
        .post('/auth/login')
        .send({ email: 'login-test@example.com', password: 'password123' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should fail with wrong password', () => {
      return request(httpServer)
        .post('/auth/login')
        .send({ email: 'login-test@example.com', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('GET /health', () => {
    it('should return health status', () => {
      return request(httpServer)
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('version');
        });
    });
  });

  describe('Authenticated endpoint', () => {
    let accessToken: string;

    beforeAll(async () => {
      const res = await request(httpServer)
        .post('/auth/register')
        .send({ email: 'auth-test@example.com', password: 'password123' });
      accessToken = (res.body as { access_token: string }).access_token;
    });

    it('should access protected route with valid token', () => {
      return request(httpServer)
        .get('/health')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
