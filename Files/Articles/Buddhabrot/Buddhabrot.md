# The Buddhabrot in C\# #

### Wallpaper
[![Brot - RGB Composite](Buddhabrot-wallpaper.png)](Buddhabrot-wallpaper.png)

### RGB Composite
[![Brot - Combined](tn-brot-combined.png)](brot-combined.png)

### Another Composite
[![Brot - Combined](tn-brotx-composite2.png)](brotx-composite2.png)

### 20 Iterations
[![Brot - Combined](tn-brotx20.png)](brotx20.png)

### 100 Iterations
[![Brot - Combined](tn-brotx100.png)](brotx100.png)

### 1000 Iterations
[![Brot - Combined](tn-brotx1000.png)](brotx1000.png)

# The Code

```C#
	using System;
	using System.Drawing;
	using System.Drawing.Imaging;
	using System.Globalization;
	using System.Linq;
	using System.Numerics;
	using System.Runtime.InteropServices;
	using System.Threading.Tasks;

	namespace Buddhabrot
	{
		public class Brot
		{
			#region Startup Code

			static void Main(string[] args)
			{
				if (args.Length == 0)
					args = "-file c:\\brot.bmp -w 1080 -h 1980 -it 5000 -xmin -2.0 -xmax 1.1".Split();

				var file = Get<string>("file", args);
				var width = Get<int?>("w", args) ?? 1000;
				var height = Get<int?>("h", args) ?? 1000;
				var iter = Get<int?>("it", args) ?? 100;
				var xmin = Get<double?>("xmin", args) ?? -2;
				var xmax = Get<double?>("xmax", args) ?? 2;

				var brot = new Brot(file, width, height, xmin, xmax, iter);
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

			private readonly int threadCount;
			private readonly string file;
			private readonly int width;
			private readonly int height;
			private readonly int iterations;
			private readonly double[][] arrays;
			private readonly Random[] randomGenerators;

			private readonly double xMin = -2;
			private readonly double xMax = 2;
			private readonly double yMin = -2;
			private readonly double yMax = 2;

			private readonly double xSize;
			private readonly double ySize;

			private readonly double nxFactor;
			private readonly double nyFactor;

			public Brot(string file, int width, int height, double xMin, double xMax, int iterations)
			{
				var aspectRatio = width / (double)height;
				threadCount = Environment.ProcessorCount;
				this.file = file;
				this.width = width;
				this.height = height;
				this.iterations = iterations;

				this.xMin = xMin;
				this.xMax = xMax;
				xSize = xMax - xMin;

				ySize = xSize / aspectRatio;
				yMin = -ySize / 2;
				yMax = ySize / 2;

				arrays = new double[threadCount][];
				randomGenerators = new Random[threadCount];

				nxFactor = 1 / xSize * width;
				nyFactor = 1 / ySize * height;

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
					if ((DateTime.Now - time).TotalSeconds >= 5.0)
					{
						Console.WriteLine("Calculated {0:0.0} Million samples", samples / 1000000.0);
						SaveImage(file, true);
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

					var zr = 0.0;
					var zi = 0.0;
					var cr = x;
					var ci = y;

					// check for escape
					for (var i = 0; i < iterations; i++)
					{
						var zzr = zr * zr - zi * zi;
						var zzi = zr * zi + zi * zr;
						zr = zzr + cr;
						zi = zzi + ci;

						if ((zr * zr + zi * zi) > 4)
							break;
					}

					if ((zr * zr + zi * zi) > 4) // did escape
					{
						zr = 0;
						zi = 0;
						for (var i = 0; i < iterations; i++)
						{
							var zzr = zr * zr - zi * zi;
							var zzi = zr * zi + zi * zr;
							zr = zzr + cr;
							zi = zzi + ci;

							if ((zr * zr + zi * zi) > 14)
								break;

							IncreasePixel(arr, zr, zi);
							IncreasePixel(arr, zr, -zi);
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

				var nx = (int)((x - xMin) * nxFactor);
				var ny = (int)((y - yMin) * nyFactor);
				var idx = nx + ny * width;
				arr[idx]++;
			}

			public void SaveImage(string filename, bool combine)
			{
				double[] totalMatrix;

				if (combine)
				{
					totalMatrix = new double[width * height];
					Parallel.For(0, arrays[0].Length, i =>
					{
						totalMatrix[i] = arrays.Sum(x => x[i]);
					});
				}
				else
				{
					totalMatrix = arrays[0];
				}

				var values = totalMatrix.OrderBy(x => x).ToArray();
				var limit = values[(int)(values.Length * 0.99995)];

				var ch = 3;
				var imageData = new byte[width * height * ch];
				for (int y = 0; y < height; y++)
				{
					Parallel.For(0, width, x =>
					{
						var val = totalMatrix[x + y * width] / limit * 256;
						if (val > 255)
							val = 255;

						imageData[3 * (x + y * width) + 0] = (byte)(val);
						imageData[3 * (x + y * width) + 1] = (byte)(val);
						imageData[3 * (x + y * width) + 2] = (byte)(val);
					});
				}

				var bitmap = new Bitmap(width, height, PixelFormat.Format24bppRgb);
				var bmData = bitmap.LockBits(new Rectangle(0, 0, bitmap.Width, bitmap.Height), ImageLockMode.ReadWrite, bitmap.PixelFormat);
				var pNative = bmData.Scan0;
				Marshal.Copy(imageData, 0, pNative, width * height * ch);
				bitmap.UnlockBits(bmData);
				bitmap.Save(filename);
			}
		}

		static class Ext
		{
			public static Complex Conjugate(this Complex val)
			{
				return new Complex(val.Real, -val.Imaginary);
			}
		}
	}

```
