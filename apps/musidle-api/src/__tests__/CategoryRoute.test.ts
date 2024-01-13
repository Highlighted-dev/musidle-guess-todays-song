import request from 'supertest';
import { app } from '../index';
import { ICategory } from '../@types/categories';

const checkCategoryStructure = (category: ICategory) => {
  expect(category).toHaveProperty('_id');
  expect(category).toHaveProperty('category');
};

describe('GET /categories', () => {
  it('responds with a list of categories', async () => {
    const response = await request(app)
      .get('/externalApi/categories')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);

    response.body.forEach((category: ICategory) => {
      checkCategoryStructure(category);
    });
  });
});

describe('GET /categories/:id', () => {
  it('responds with a specific category', async () => {
    const id = '650053c778b66f9fbfd37b21';
    const response = await request(app)
      .get(`/externalApi/categories/${id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    checkCategoryStructure(response.body);
  });
});

describe('POST /categories', () => {
  it('creates a new category', async () => {
    const response = await request(app)
      .post('/externalApi/categories')
      .send({
        category: 'TestCategory',
      })
      .expect('Content-Type', /json/)
      .expect(201);

    checkCategoryStructure(response.body);
  });
});

describe('PUT /categories/:id', () => {
  it('updates a category', async () => {
    const id = '650053c778b66f9fbfd37b21';
    const response = await request(app)
      .put(`/externalApi/categories/${id}`)
      .send({
        category: 'TestCategory',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    checkCategoryStructure(response.body);
    expect(response.body.category).toBe('TestCategory');
  });
  it('updates the category back to the original', async () => {
    const id = '650053c778b66f9fbfd37b21';
    const response = await request(app)
      .put(`/externalApi/categories/${id}`)
      .send({
        category: 'pop',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    checkCategoryStructure(response.body);
    expect(response.body.category).toBe('pop');
  });
});

describe('DELETE /categories/:id', () => {
  it('Gets category id of "TestCategory" and deletes that category', async () => {
    const response = await request(app)
      .get('/externalApi/categories')
      .expect('Content-Type', /json/)
      .expect(200);

    // find the category id of "TestCategory"
    let categoryId = '';
    response.body.forEach((category: ICategory) => {
      if (category.category === 'TestCategory') {
        categoryId = category._id;
      }
    });

    // delete the category
    await request(app).delete(`/externalApi/categories/${categoryId}`).expect(204);
  });
});
