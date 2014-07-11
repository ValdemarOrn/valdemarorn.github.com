# The Buddhabrot in C\# #

### Combined RGB
[![Brot - Combined](tn-brot-combined.png)](tn-brot-combined.png)

### 20 Iterations
[![Brot - Combined](tn-brotx20.png)](tn-brotx20.png)

### 100 Iterations
[![Brot - Combined](tn-brotx100.png)](tn-brotx100.png)

### 1000 Iterations
[![Brot - Combined](tn-brotx1000.png)](tn-brotx1000.png)

# The Code

    using System;
	using System.Collections.Generic;
	using System.Drawing;
	using System.Drawing.Imaging;
	using System.Globalization;
	using System.Linq;
	using System.Numerics;
	using System.Text;
	using System.Threading;
	using System.Threading.Tasks;

	namespace Buddhabrot
	{
		public class Brot
		{
			#region Startup Code

			static void Main(string[] args)
			{
				var file = Get<string>("file", args);
				var width = Get<int?>("w", args) ?? 1000;
				var height = Get<int?>("h", args) ?? 600;
				var iter = Get<int?>("it", args) ?? 100;
				var log = Get<bool?>("log", args) ?? false;
				var xmin = Get<double?>("xmin", args) ?? -2;
				var xmax = Get<double?>("xmax", args) ?? 2;

				var brot = new Brot(file, width, height, xmin, xmax, iter, log);
				Task.Run(() => brot.UpdateImage());

				Console.WriteLine("Press Enter to Stop");
				Console.ReadLine();
			}

			/// <summary>
			/// Parse command line arguments
			/// </summary>
			private static T Get<T>(string flag, string[] args)
			{
				var value = args.SkipWhile(x => !x.StartsWith("-" + flag)).Skip(1).Take(1).FirstOrDefault();
				if (value == null)
					return default(T);

				if (typeof(T) == typeof(string))
				{
					return (T)(object)value;
				}
				if (typeof(T) == typeof(double?))
				{
					double output;
					var ok = double.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out output);
					return ok ? (T)(object)output : (T)(object)null;
				}
				if (typeof(T) == typeof(int?))
				{
					int output;
					var ok = int.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out output);
					return ok ? (T)(object)output : (T)(object)null;
				}
				if (typeof(T) == typeof(bool?))
				{
					var isTrue = value.ToLower() == "true" || value == "1";
					return (T)(object)isTrue;
				}
				return default(T);
			}

			#endregion

			private const double EscapeThreshold = 4.0;

			private readonly int threadCount;
			private readonly string file;
			private readonly int width;
			private readonly int height;
			private readonly int iterations;
			private readonly bool logarithmic;
			private readonly double[][] arrays;
			private readonly Random[] randomGenerators;

			private readonly double xMin = -2;
			private readonly double xMax = 2;
			private readonly double yMin = -2;
			private readonly double yMax = 2;

			private readonly double xSize;
			private readonly double ySize;

			public Brot(string file, int width, int height, double xMin, double xMax, int iterations, bool logarithmic)
			{
				var aspectRatio = width / (double)height;
				threadCount = Environment.ProcessorCount;
				this.file = file;
				this.width = width;
				this.height = height;
				this.iterations = iterations;
				this.logarithmic = logarithmic;

				this.xMin = xMin;
				this.xMax = xMax;
				xSize = xMax - xMin;

				ySize = xSize / aspectRatio;
				yMin = -ySize / 2;
				yMax = ySize / 2;

				arrays = new double[threadCount][];
				randomGenerators = new Random[threadCount];

				for (int i = 0; i < threadCount; i++)
				{
					arrays[i] = new double[width * height];
					randomGenerators[i] = new Random(i);
				}
			}

			public void UpdateImage()
			{
				var iter = (int)(100000 + 10000000.0 / iterations);
				long samples = 0;
				var time = DateTime.Now;
				while (true)
				{
					Parallel.For(0, threadCount, thread => Run(thread, iter));
					samples += iter * threadCount;
					if ((DateTime.Now - time).TotalSeconds >= 3.0)
					{
						Console.WriteLine("Calculated {0:0.0} Million samples", samples / 1000000.0);
						SaveImage(file);
						time = DateTime.Now;
					}
				}
			}

			private void Run(int thread, int n)
			{
				// Each thread has a local array. They get combined in the output stage.
				// Saves us from having to synchronize the threads.
				var arr = arrays[thread];
				var rand = randomGenerators[thread];

				while (n-- > 0)
				{
					// all points in mandelbrot set are between -2...2
					var x = rand.NextDouble() * 8 - 4;
					var y = rand.NextDouble() * 8 - 4;

					var z = new Complex(0, 0);
					var c = new Complex(x, y);

					// check for escape
					for (var i = 0; i < iterations; i++)
					{
						z = (z * z) + c;
						if (z.Magnitude > EscapeThreshold)
							break;
					}

					if (z.Magnitude > EscapeThreshold) // did escape
					{
						z = 0;
						for (var i = 0; i < iterations; i++)
						{
							z = (z * z) + c;
							if (z.Magnitude > 4)
								break;

							IncreasePixel(arr, z.Real, z.Imaginary);
						}
					}
				}
			}

			private void IncreasePixel(double[] arr, double x, double y)
			{
				if (x > xMax || x < xMin)
					return;
				if (y > yMax || y < yMin)
					return;

				var nx = (int)((x - xMin) / xSize * width);
				var ny = (int)((y - yMin) / ySize * height);
				var idx = nx + ny * width;
				arr[idx] = arr[idx] + 1;
			}

			public void SaveImage(string filename)
			{
				var totalMatrix = new double[width * height];
				for (var i = 0; i < arrays[0].Length; i++)
				{
					totalMatrix[i] = arrays.Sum(x => x[i]);
					if (logarithmic)
						totalMatrix[i] = Math.Log(1 + totalMatrix[i]);
				}

				var min = totalMatrix.Min();
				var max = totalMatrix.Max() + 0.0001;
				var ch = 3;
				var imageData = new byte[width * height * ch];
				for (int y = 0; y < height; y++)
				{
					for (var x = 0; x < width; x++)
					{
						var val = (totalMatrix[x + y * width] - min) / (max - min);

						imageData[3 * (x + y * width) + 0] = (byte)(256 * val);
						imageData[3 * (x + y * width) + 1] = (byte)(256 * val);
						imageData[3 * (x + y * width) + 2] = (byte)(256 * val);
					}
				}

				var bitmap = new Bitmap(width, height, PixelFormat.Format24bppRgb);
				var bmData = bitmap.LockBits(new Rectangle(0, 0, bitmap.Width, bitmap.Height), ImageLockMode.ReadWrite, bitmap.PixelFormat);
				var pNative = bmData.Scan0;
				System.Runtime.InteropServices.Marshal.Copy(imageData, 0, pNative, width * height * ch);
				bitmap.UnlockBits(bmData);
				bitmap.Save(filename);
			}
		}
	}

