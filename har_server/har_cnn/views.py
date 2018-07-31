from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .functions import *
 
class HarCnn(APIView):
  """
  A custom endpoint for GET request.
  """
  def get(self, request, format=None):
    """
    Return a hardcoded response.
    """
    #dataset for training
    print("Reading the testing dataset")
    dataset = read_data('/Users/kananekatichatviwat/Documents/PARSYSTEM/uploads/data.txt')
    dataset.dropna(axis=0, how='any', inplace= True)
    dataset.drop_duplicates(['user-id','activity','timestamp', 'x-axis', 'y-axis', 'z-axis'], keep= 'first', inplace= True)
    dataset['x-axis'] = feature_normalize(dataset['x-axis'])
    dataset['y-axis'] = feature_normalize(dataset['y-axis'])
    dataset['z-axis'] = feature_normalize(dataset['z-axis'])

    print("Segment dataset for testing dataset")
    segments, labels, timestamp, xAxis, yAxis, zAxis = segment_signal(dataset)
    labels = np.asarray(pd.get_dummies(labels), dtype = np.int8)
    reshaped_segments = segments.reshape(len(segments), 1, 90, 3)

    test_x = reshaped_segments

    input_height = 1
    input_width = 90
    num_labels = 6
    num_channels = 3

    kernel_size = 60
    depth = 60
    num_hidden = 1000

    X = tf.placeholder(tf.float32, shape=[None,input_height,input_width,num_channels])
    Y = tf.placeholder(tf.float32, shape=[None,num_labels])

    c = apply_depthwise_conv(X,kernel_size,num_channels,depth)
    p = apply_max_pool(c,20,2)
    c = apply_depthwise_conv(p,6,depth*num_channels,depth//10)

    shape = c.get_shape().as_list()
    c_flat = tf.reshape(c, [-1, shape[1] * shape[2] * shape[3]])

    f_weights_l1 = weight_variable([shape[1] * shape[2] * depth * num_channels * (depth//10), num_hidden])
    f_biases_l1 = bias_variable([num_hidden])
    f = tf.nn.tanh(tf.add(tf.matmul(c_flat, f_weights_l1),f_biases_l1))

    out_weights = weight_variable([num_hidden, num_labels])
    out_biases = bias_variable([num_labels])

    #using this function to predict the human activities
    y_ = tf.nn.softmax(tf.matmul(f, out_weights) + out_biases)

    #extract the result of prediction#
    prediction = tf.argmax(y_,1)

    result = []
    saver = tf.train.Saver()
    print("Prediction processing")
    with tf.Session() as session:
        saver.restore(session, "/tmp/model.ckpt")
        result = prediction.eval(feed_dict={X: test_x}, session=session)

    prediction_list = []
    for i in result:
        if i == 0:
            prediction_list.append('Walking')
        if i == 1:
            prediction_list.append('Jogging')
        if i == 2:
            prediction_list.append('Stairs')
        if i == 3:
            prediction_list.append('Sitting')
        if i == 4:
            prediction_list.append('Standing')
        if i == 5:
            prediction_list.append('LyingDown')
    
    return Response({"activitiesList": prediction_list, "time": timestamp,"x-axis": xAxis,"y-axis":yAxis,"z-axis":zAxis})
