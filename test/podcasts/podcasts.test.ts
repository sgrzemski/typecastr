import app from '../../source/app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';

let firstPodcastIdTest = '';
const firstPodcastBody = {
    title: 'Astrophysics for People in a Hurry',
    author: 'Neil deGrasse Tyson',
    filename: 'astrophysics-for-people-in-a-hurry.mp3',
};

const newAuthor = 'Stephen Hawking';
const newTitle = 'Black Holes and Baby Universes';
const newFileName = 'black-holes-and-baby-universes.mp3';
const patchTitle = 'Surely You\'re Joking, Mr Feynman!';

describe('podcasts endpoints', function () {
    let request: supertest.SuperAgentTest;
    before(function () {
        request = supertest.agent(app);
    });
    after(function (done) {
        app.close((closeError) => {
          console.log('Closing server.')
          process.exit(closeError ? 1 : 0)
        });
    });

    it('should allow a POST to /podcasts', async function () {
        const res = await request.post('/podcasts').send(firstPodcastBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.a('string');
        firstPodcastIdTest = res.body.id;
    });

    describe('with a single podcast created', function () {
        it('should allow a GET from /podcasts/:podcastId', async function () {
            const res = await request
                .get(`/podcasts/${firstPodcastIdTest}`)
                .send();
            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object');
            expect(res.body.id).to.be.a('string');
            expect(res.body.id).to.equal(firstPodcastIdTest);
        });

        let updatePodcastBody = {
            title: newTitle,
            author: newAuthor,
            filename: newFileName,
        }

        it('should allow a PUT a new podcast at /podcasts/:podcastId', async function () {
            const res = await request
                .put(`/podcasts/${firstPodcastIdTest}`)
                .send(updatePodcastBody);
            expect(res.status).to.equal(204);
        });

        let patchPodcastBody = {
            title: patchTitle,
        }

        it('should allow to PATCH a podcast at /podcasts/:podcastId', async function () {
            const res = await request
                .patch(`/podcasts/${firstPodcastIdTest}`)
                .send(patchPodcastBody);
            expect(res.status).to.equal(204);
        });

        it('should contain updated information GET from /podcasts/:podcastId', async function () {
            const res = await request
                .get(`/podcasts/${firstPodcastIdTest}`)
                .send();
            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object');
            expect(res.body.id).to.be.a('string');
            expect(res.body.id).to.equal(firstPodcastIdTest);
            expect(res.body.title).to.equal(patchTitle);
            expect(res.body.author).to.equal(newAuthor);
            expect(res.body.filename).to.equal(newFileName);
        });

        it('should allow DELETE from /podcasts/:podcastId', async function () {
            const res = await request
                .delete(`/podcasts/${firstPodcastIdTest}`)
                .send();
            expect(res.status).to.equal(204);
        });
    });
});