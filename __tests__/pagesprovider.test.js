import R from 'ramda';
import PagesProvider from './../app/PagesProvider';

test('check default constructor', () => {
    let pp = new PagesProvider();
    expect(pp).not.toBeUndefined();
    expect(pp.pages).toEqual({});
    expect(pp._baseFile).toEqual('pages.json');
});

test('check a complete load process', () => {
    let pp = new PagesProvider({baseFile : "./tmp/test_pages.json"});
    expect(pp).not.toBeUndefined();
    expect(pp._baseFile).toEqual('./tmp/test_pages.json');
    expect(pp.pages).toEqual({});

    pp.loadPages();
    expect(pp.pages).not.toBeUndefined();

    pp.worksOnPages('test2', (pages) => {
        expect(R.length(pages)).toBe(2);
    });
});
