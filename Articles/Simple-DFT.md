<!--
{
    "Id": "Simple-DFT",
	"WindowTitle": "",
	"Title": "A very simple Discrete Fourier Transform implemented in C#",
    "Date": "2013-06-04"
}
-->

While I wouldn't recommend this for your production code, it was a fun exercise to refresh my memory on how the DFT actually works.

I later built an FFT implementation in both C# and C++, which you can [find on my Github](https://github.com/ValdemarOrn/LowProfile.FFT).

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	
	namespace SimpleDFT
	{
	    class SimpleDFT
	    {
	        static void Main(string[] args)
	        {
	            var s = new double[1024];
	            for(int i=0; i<s.Length; i++)
	                s[i] = Math.Cos(2 * Math.PI * 1 / 1024 * i);
	
	            var d = DFT(s);
	
	            double normalizer = 1.0 / s.Length * 2;
	            for (int i = 0; i < d.Item1.Length; i++)
	            {
	                d.Item1[i] = d.Item1[i] * normalizer;
	                d.Item2[i] = d.Item2[i] * normalizer;
	            }
	
	            var output = IDFT(d.Item1, d.Item2);
	        }
	
	        /// <summary>
	        /// Provides the Discrete Fourier Transform for a real-valued input signal
	        /// </summary>
	        /// <param name="input">the signal to transform</param>
	        /// <param name="partials">the maximum number of partials to calculate. If not value is given it defaults to input/2</param>
	        /// <returns>The Cos and Sin components of the signal, respectively</returns>
	        public static Tuple<double[], double[]> DFT(double[] input, int partials = 0)
	        {
	            int len = input.Length;
	            double[] cosDFT = new double[len / 2 + 1];
	            double[] sinDFT = new double[len / 2 + 1];
	
	            if (partials == 0)
	                partials = len / 2;
	
	            for (int n = 0; n <= partials ; n++)
	            {
	                double cos = 0.0;
	                double sin = 0.0;
	                
	                for (int i = 0; i < len; i++)
	                {
	                    cos += input[i] * Math.Cos(2 * Math.PI * n / len * i);
	                    sin += input[i] * Math.Sin(2 * Math.PI * n / len * i);
	                }
	
	                cosDFT[n] = cos;
	                sinDFT[n] = sin;
	            }
	
	            return new Tuple<double[], double[]>(cosDFT, sinDFT);
	        }
	
	        /// <summary>
	        /// Takes the real-valued Cos and Sin components of Fourier transformed signal and reconstructs the time-domain signal
	        /// </summary>
	        /// <param name="cos">Array of cos components, containing frequency components from 0 to pi. sin.Length must match cos.Length</param>
	        /// <param name="sin">Array of sin components, containing frequency components from 0 to pi. sin.Length must match cos.Length</param>
	        /// <param name="len">
	        /// The length of the output signal. 
	        /// If len < (partials-1)*2 then frequency data will be lost in the output signal. 
	        /// if no len parameter is given it defaults to (partials-1)*2
	        /// </param>
	        /// <returns>the real-valued time-domain signal</returns>
	        public static double[] IDFT(double[] cos, double[] sin, int len = 0)
	        {
	            if (cos.Length != sin.Length) throw new ArgumentException("cos.Length and sin.Length bust match!");
	
	            if (len == 0)
	                len = (cos.Length - 1) * 2;
	
	            double[] output = new double[len];
	
	            int partials = sin.Length;
	            if (partials > len / 2)
	                partials = len / 2;
	
	            for (int n = 0; n <= partials; n++)
	            {
	                for (int i = 0; i < len; i++)
	                {
	                    output[i] += Math.Cos(2 * Math.PI * n / len * i) * cos[n];
	                    output[i] += Math.Sin(2 * Math.PI * n / len * i) * sin[n];
	                }
	            }
	
	            return output;
	        }
	    }
	}