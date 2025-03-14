import { jest } from '@jest/globals';
import { generateSlug } from '../../utils/generateSlug';
import Url from '../../models/url.model';

// Define the type for the findOne mock function
type FindOneMock = jest.MockedFunction<typeof Url.findOne>;

// Mock the Url model
jest.mock('../../models/url.model', () => ({
  findOne: jest.fn(),
}));

describe('generateSlug Utility', () => {
  let findOneMock: FindOneMock;

  beforeEach(() => {
    jest.clearAllMocks();
    findOneMock = Url.findOne as FindOneMock;
  });

  it('should generate a unique slug', async () => {
    // Mock findOne to return null (no existing slug)
    findOneMock.mockResolvedValue(null);
    
    const slug = await generateSlug();
    
    // Check the slug format - should be 6 characters
    expect(slug).toBeDefined();
    expect(typeof slug).toBe('string');
    expect(slug.length).toBe(6);
    
    // Verify findOne was called with the generated slug
    expect(findOneMock).toHaveBeenCalledWith({ slug });
  });

  it('should regenerate slug if first one already exists', async () => {
    // Mock findOne to return a value the first time and null the second time
    findOneMock
      .mockResolvedValueOnce({ slug: 'abc123' })
      .mockResolvedValueOnce(null);
    
    const slug = await generateSlug();
    
    // Verify slug was generated
    expect(slug).toBeDefined();
    
    // Verify findOne was called twice (first slug exists, second is unique)
    expect(findOneMock).toHaveBeenCalledTimes(2);
  });
});
