import Mock, {MockjsRandom} from 'mockjs';

const Random: MockjsRandom = Mock.Random;

const test = () => {
    return {
        code: 200,
        msg: 'success',
        data: Random.string(16),
    };
};

Mock.mock('/test', 'post', test());