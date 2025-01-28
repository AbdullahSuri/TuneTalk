import { expect } from 'chai';
import request from 'supertest';
import { app, server } from '../app.mjs'; // Ensure app and server are exported in app.mjs

describe('App Tests', function () {
    it('should render the home page with featured albums', async function () {
        const response = await request(app).get('/');
        expect(response.status).to.eql(200);
        expect(response.text).to.include('Discover, rate, and immerse');
    });

    it('should render the albums list page', async function () {
        const response = await request(app).get('/albums');
        expect(response.status).to.eql(200);
        expect(response.text).to.include('Albums');
    });

    it('should return search results for a valid album query', async function () {
        const response = await request(app)
            .post('/albums/search')
            .send({ query: 'Astroworld' });
        expect(response.status).to.eql(200);
        expect(response.text).to.include('Astroworld');
    });

    it('should render album details for a valid album ID', async function () {
        const validAlbumId = '672ebd76fcc4a0f010fce1f4';
        const response = await request(app).get(`/album/${validAlbumId}`);
        expect(response.status).to.eql(200);
        expect(response.text).to.include('Reviews');
    });

    after(function () {
        server.close();
    });
});
