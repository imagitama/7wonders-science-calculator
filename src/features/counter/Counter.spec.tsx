import { getResult, getAllResults } from './Counter'

const getScoreFromResult = (result: any): number => result.score
const getScoresFromResults = (results: any[]): number[] => results.map(result => result.score)

describe('getResult', () => {
    it('With no symbols', () => {
        expect(getScoreFromResult(getResult([], 0, 0, 0))).toBe(0)
    })

    it('With 1 symbol each', () => {
        expect(getScoreFromResult(getResult([], 1, 1, 1))).toBe(10) // (7) + 1 + 1 + 1
    })
    
    it('With 2 symbols each', () => {
        expect(getScoreFromResult(getResult([], 2, 2, 2))).toBe(26) // (14) + 4 + 4 + 4
    })

    it('With 1, 2, 3 symbols', () => {
        expect(getScoreFromResult(getResult([], 1, 2, 3))).toBe(21) // (7) + 1 + 4 + 9
    })

    it('With 10, 11, 12 symbols', () => {
        expect(getScoreFromResult(getResult([], 10, 11, 12))).toBe(435) // (70) + 100 + 121 + 144
    })
})

describe('getAllResults', () => {
    it('With 1 symbol each and 1 wild', () => {
        expect(getScoresFromResults(getAllResults(1, 1, 1, 1, 0))).toEqual([13, 13, 13])
    })

    it('With 2 symbol each and 2 wilds', () => {
        expect(getScoresFromResults(getAllResults(2, 2, 2, 2, 0))).toEqual([38, 38, 38, 36, 36, 36])
        // (14) + 16 + 4 + 4
        // (14) + 9 + 9 + 4
    })

    it('With 1, 2, 3 symbols and 3 wilds', () => {
        expect(getScoresFromResults(getAllResults(1, 2, 3, 3, 0))).toEqual([43, 42, 48, 43, 48, 43, 42, 40, 47, 43])
        // (14) + 16 + 4 + 9
        // (7) + 1 + 25 + 9
        // (7) + 1 + 4 + 36
        
        // (14) + 4 + 9 + 16

        // (21) + 9 + 9 + 9
        // (14) + 4 + 16 + 9

        // (7) + 1 + 9 + 25
        // (7) + 1 + 16 + 16

        // (14) + 4 + 4 + 25
        // (14) + 9 + 4 + 16
    })

    it('With 1 symbol each and 1 wild and 1 clone', () => {
        expect(getScoresFromResults(getAllResults(1, 1, 1, 1, 1))).toEqual([18, 18, 18]) // (7) + 9 + 1 + 1 
    })

    it('With 1, 2, 3 symbols and 1 wild and 1 clone', () => {
        expect(getScoresFromResults(getAllResults(1, 2, 3, 1, 1))).toEqual([38, 33, 33, 37])
        // (14) + 4 + 4 + 16
        // (7) + 1 + 16 + 9
        // (tie)
        // (7) + 1 + 4 + 25
    })

    it('With 1, 2, 3 symbols and 3 wilds and 3 clones', () => {
        expect(getScoresFromResults(getAllResults(1, 2, 3, 3, 3)).shift()).toBe(76)
        // (14) + 49 + 4 + 9
    })
})