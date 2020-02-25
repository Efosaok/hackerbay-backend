import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server';

import createToken from '../src/utilities/createToken';

describe('Microservice test suite', () => {
  describe('POST /api/v1/auth', () => {
    it('returns token with status code 200', (done) => {
      request(app)
        .post('/api/v1/auth')
        .send({ username: 'test', password: 'testpass' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const { message, token } = res.body;
          expect(message).to.equal('Authentication successfull');
          expect(typeof token).to.be.a('string');
          done();
        });
    });

    it('returns status code 400 and error message for missing credentials', (done) => {
      request(app)
        .post('/api/v1/auth')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          const {
            message,
            errors: { username, password },
          } = res.body;
          expect(message).to.equal('Invalid Credentials');
          expect(username[0]).to.equal('this field is required');
          expect(password[0]).to.equal('this field is required');
          done();
        });
    });
  });

  describe('PATCH /api/v1/patch', () => {
    it('returns patched document with status code 200', (done) => {
      const document = {
        baz: 'qux',
        foo: 'bar',
      };
      const operations = [
        { op: 'replace', path: '/baz', value: 'boo' },
        { op: 'add', path: '/hello', value: ['world'] },
        { op: 'remove', path: '/foo' },
      ];
      request(app)
        .patch('/api/v1/patch')
        .send({ document, operations })
        .set('Accept', 'application/json')
        .set('Authorization', createToken({ username: 'test' }))
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const {
            message,
            patchedDocument,
          } = res.body;
          expect(message).to.equal('Patch applied');
          expect(patchedDocument.baz).to.equal('boo');
          expect(patchedDocument.hello[0]).to.equal('world');
          done();
        });
    });

    it('returns status code 400 if operation(s) is not specified', (done) => {
      const document = {
        baz: 'qux',
        foo: 'bar',
      };
      request(app)
        .patch('/api/v1/patch')
        .send({ document, operations: [] })
        .set('Accept', 'application/json')
        .set('Authorization', createToken({ username: 'test' }))
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          const { message, errors } = res.body;
          expect(message).to.equal('Invalid Credentials');
          expect(errors.operations[0]).to.equal('this field is required');
          done();
        });
    });

    it('returns status code 500 if document does not match operation(s)', (done) => {
      const document = { baz: 'qux' };
      const operations = [
        { op: 'replace', path: '/baz', value: 'boo' },
        { op: 'add', path: '/hello', value: ['world'] },
        { op: 'remove', path: '/foo' },
      ];
      request(app)
        .patch('/api/v1/patch')
        .send({ document, operations })
        .set('Accept', 'application/json')
        .set('Authorization', createToken({ username: 'test' }))
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err, res) => {
          const {
            error,
          } = res.body;
          expect(error.message).to.equal('Remove operation must point to an existing value!');
          done();
        });
    });

    it('returns status code 401 and error message if token is not parsed', (done) => {
      const document = { baz: 'qux' };
      const operations = [
        { op: 'replace', path: '/baz', value: 'boo' },
        { op: 'add', path: '/hello', value: ['world'] },
        { op: 'remove', path: '/foo' },
      ];
      request(app)
        .patch('/api/v1/patch')
        .send({ document, operations })
        .set('Accept', 'application/json')
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          const {
            message,
          } = res.body;
          expect(message).to.equal('no token found');
          done();
        });
    });

    it('returns status code 401 and error message if token is invalid', (done) => {
      const document = { baz: 'qux' };
      const operations = [
        { op: 'replace', path: '/baz', value: 'boo' },
        { op: 'add', path: '/hello', value: ['world'] },
        { op: 'remove', path: '/foo' },
      ];
      request(app)
        .patch('/api/v1/patch')
        .send({ document, operations })
        .set('Accept', 'application/json')
        .set('Authorization', 'invalid')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          const {
            message,
          } = res.body;
          expect(message).to.equal('invalid token');
          done();
        });
    });
  });

  describe('POST /api/v1/thumbnail', () => {
    it('returns status code 200 and generated thumbnail', (done) => {
      request(app)
        .post('/api/v1/thumbnail')
        .send({ imageUrl: 'https://res.cloudinary.com/dn93xk5ni/image/upload/v1494879173/images_11_yyd5dn.jpg' })
        .set('Accept', 'application/json')
        .set('Authorization', createToken({ username: 'test' }))
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const { message, thumbnail } = res.body;
          expect(message).to.equal('thumbnail generated');
          expect(typeof thumbnail).to.be.a('string');
          done();
        });
    });

    it('returns status code 404 if imageUrl specified points to a non-existing image', (done) => {
      request(app)
        .post('/api/v1/thumbnail')
        .send({ imageUrl: 'https://res.cloudinary.com/dn93xk5ni/image/upload/non-existing-image.jpg' })
        .set('Accept', 'application/json')
        .set('Authorization', createToken({ username: 'test' }))
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    it('returns status code 400 aif imageUrl specified is invalid', (done) => {
      request(app)
        .post('/api/v1/thumbnail')
        .send({ imageUrl: 'https://invalid-url' })
        .set('Accept', 'application/json')
        .set('Authorization', createToken({ username: 'test' }))
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          const { message, errors } = res.body;
          expect(message).to.equal('Invalid Credentials');
          expect(errors.imageUrl[0]).to.equal('this field should be a valid url');
          done();
        });
    });
  });
});
